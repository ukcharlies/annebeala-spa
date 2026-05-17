import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Pool } from 'pg';
import { isIP } from 'node:net';
import { CreateVisitDto } from './dto/create-visit.dto';

export type Visit = CreateVisitDto & {
  id: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
};

type SummaryRow = {
  total_views: string;
  unique_visitors: string;
  first_seen: string | null;
  last_seen: string | null;
};

type DailyRow = {
  day: string;
  views: string;
  unique_visitors: string;
};

type PageRow = {
  path: string;
  views: string;
};

type VisitRow = {
  id: string;
  event: 'page_view';
  path: string;
  title: string;
  referrer: string | null;
  screen: string | null;
  language: string | null;
  timezone: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
};

@Injectable()
export class AnalyticsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AnalyticsService.name);
  private visits: Visit[] = [];
  private readonly pool =
    process.env.DATABASE_URL
      ? new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl:
            process.env.DATABASE_SSL === 'false'
              ? false
              : { rejectUnauthorized: false },
        })
      : null;

  async onModuleInit() {
    if (!this.pool) {
      this.logger.warn(
        'DATABASE_URL is not set. Analytics visits will stay in memory until a database is configured.',
      );
      return;
    }

    await this.pool.query(`
      create table if not exists analytics_visits (
        id text primary key,
        event text not null,
        path text not null,
        title text not null,
        referrer text,
        screen text,
        language text,
        timezone text,
        ip_address inet,
        user_agent text,
        created_at timestamptz not null
      )
    `);

    await this.pool.query(`
      create index if not exists analytics_visits_created_at_idx
        on analytics_visits (created_at desc)
    `);

    await this.pool.query(`
      create index if not exists analytics_visits_path_idx
        on analytics_visits (path)
    `);
  }

  async onModuleDestroy() {
    await this.pool?.end();
  }

  normalizeIpAddress(value?: string | string[] | null): string | null {
    const raw = Array.isArray(value) ? value[0] : value;
    const candidate = raw?.split(',')[0]?.trim();

    if (!candidate) {
      return null;
    }

    const withoutMappedPrefix = candidate.replace(/^::ffff:/, '');
    const withoutPort = /^\d{1,3}(\.\d{1,3}){3}:\d+$/.test(
      withoutMappedPrefix,
    )
      ? withoutMappedPrefix.replace(/:\d+$/, '')
      : withoutMappedPrefix;

    return isIP(withoutPort) ? withoutPort : null;
  }

  async recordVisit(
    payload: CreateVisitDto,
    ipAddress: string | null,
    userAgent: string | null,
  ): Promise<Visit> {
    const visit: Visit = {
      ...payload,
      id: crypto.randomUUID(),
      ipAddress,
      userAgent,
      createdAt: new Date().toISOString(),
    };

    if (this.pool) {
      await this.pool.query(
        `
          insert into analytics_visits (
            id,
            event,
            path,
            title,
            referrer,
            screen,
            language,
            timezone,
            ip_address,
            user_agent,
            created_at
          )
          values ($1, $2, $3, $4, $5, $6, $7, $8, $9::inet, $10, $11)
        `,
        [
          visit.id,
          visit.event,
          visit.path,
          visit.title,
          visit.referrer ?? null,
          visit.screen ?? null,
          visit.language ?? null,
          visit.timezone ?? null,
          visit.ipAddress,
          visit.userAgent,
          visit.createdAt,
        ],
      );

      return visit;
    }

    this.visits.unshift(visit);
    this.visits = this.visits.slice(0, 5000);
    return visit;
  }

  async summary() {
    if (!this.pool) {
      return this.memorySummary();
    }

    const [summary, daily, topPages, recent] = await Promise.all([
      this.pool.query<SummaryRow>(`
        select
          count(*) as total_views,
          count(distinct coalesce(ip_address::text, 'unknown') || '|' || coalesce(user_agent, '')) as unique_visitors,
          min(created_at) as first_seen,
          max(created_at) as last_seen
        from analytics_visits
      `),
      this.pool.query<DailyRow>(`
        select
          date_trunc('day', created_at)::date::text as day,
          count(*) as views,
          count(distinct coalesce(ip_address::text, 'unknown') || '|' || coalesce(user_agent, '')) as unique_visitors
        from analytics_visits
        where created_at >= now() - interval '30 days'
        group by day
        order by day desc
      `),
      this.pool.query<PageRow>(`
        select path, count(*) as views
        from analytics_visits
        where created_at >= now() - interval '30 days'
        group by path
        order by views desc, path asc
        limit 20
      `),
      this.pool.query<VisitRow>(`
        select
          id,
          event,
          path,
          title,
          referrer,
          screen,
          language,
          timezone,
          ip_address::text as ip_address,
          user_agent,
          created_at
        from analytics_visits
        order by created_at desc
        limit 50
      `),
    ]);

    return {
      totalViews: Number(summary.rows[0]?.total_views ?? 0),
      uniqueVisitors: Number(summary.rows[0]?.unique_visitors ?? 0),
      firstSeen: summary.rows[0]?.first_seen ?? null,
      lastSeen: summary.rows[0]?.last_seen ?? null,
      last30Days: daily.rows.map((row) => ({
        day: row.day,
        views: Number(row.views),
        uniqueVisitors: Number(row.unique_visitors),
      })),
      topPages: topPages.rows.map((row) => ({
        path: row.path,
        views: Number(row.views),
      })),
      recentVisits: recent.rows.map((row) => this.mapVisitRow(row)),
    };
  }

  private memorySummary() {
    const visitors = new Set(
      this.visits.map(
        (visit) => `${visit.ipAddress ?? 'unknown'}|${visit.userAgent ?? ''}`,
      ),
    );
    const pageCounts = this.visits.reduce<Record<string, number>>(
      (counts, visit) => {
        counts[visit.path] = (counts[visit.path] ?? 0) + 1;
        return counts;
      },
      {},
    );

    return {
      totalViews: this.visits.length,
      uniqueVisitors: visitors.size,
      firstSeen: this.visits.at(-1)?.createdAt ?? null,
      lastSeen: this.visits[0]?.createdAt ?? null,
      last30Days: [],
      topPages: Object.entries(pageCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([path, views]) => ({ path, views })),
      recentVisits: this.visits.slice(0, 50),
    };
  }

  private mapVisitRow(row: VisitRow): Visit {
    return {
      id: row.id,
      event: row.event,
      path: row.path,
      title: row.title,
      referrer: row.referrer ?? undefined,
      screen: row.screen ?? undefined,
      language: row.language ?? undefined,
      timezone: row.timezone ?? undefined,
      ipAddress: row.ip_address,
      userAgent: row.user_agent,
      createdAt: row.created_at,
    };
  }
}
