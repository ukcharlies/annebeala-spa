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
  browser: string;
  operatingSystem: string;
  deviceType: string;
  createdAt: string;
};

type SummaryRow = {
  total_events: string;
  total_views: string;
  unique_visitors: string;
  sessions: string;
  first_seen: string | null;
  last_seen: string | null;
  avg_duration_ms: string | null;
  avg_scroll_depth: string | null;
};

type DailyRow = {
  day: string;
  views: string;
  unique_visitors: string;
  sessions: string;
};

type MetricRow = {
  label: string | null;
  views: string;
};

type VisitRow = {
  id: string;
  event: 'page_view' | 'engagement';
  visitor_id: string | null;
  session_id: string | null;
  path: string;
  url: string | null;
  title: string;
  referrer: string | null;
  screen: string | null;
  viewport: string | null;
  device_pixel_ratio: string | null;
  connection_type: string | null;
  language: string | null;
  timezone: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  duration_ms: number | null;
  max_scroll_depth: number | null;
  ip_address: string | null;
  user_agent: string | null;
  browser: string | null;
  operating_system: string | null;
  device_type: string | null;
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
        visitor_id text,
        session_id text,
        path text not null,
        url text,
        title text not null,
        referrer text,
        screen text,
        viewport text,
        device_pixel_ratio numeric,
        connection_type text,
        language text,
        timezone text,
        utm_source text,
        utm_medium text,
        utm_campaign text,
        duration_ms integer,
        max_scroll_depth integer,
        ip_address inet,
        user_agent text,
        browser text,
        operating_system text,
        device_type text,
        created_at timestamptz not null
      )
    `);

    await this.addColumnIfMissing('visitor_id', 'text');
    await this.addColumnIfMissing('session_id', 'text');
    await this.addColumnIfMissing('url', 'text');
    await this.addColumnIfMissing('viewport', 'text');
    await this.addColumnIfMissing('device_pixel_ratio', 'numeric');
    await this.addColumnIfMissing('connection_type', 'text');
    await this.addColumnIfMissing('utm_source', 'text');
    await this.addColumnIfMissing('utm_medium', 'text');
    await this.addColumnIfMissing('utm_campaign', 'text');
    await this.addColumnIfMissing('duration_ms', 'integer');
    await this.addColumnIfMissing('max_scroll_depth', 'integer');
    await this.addColumnIfMissing('browser', 'text');
    await this.addColumnIfMissing('operating_system', 'text');
    await this.addColumnIfMissing('device_type', 'text');

    await this.pool.query(`
      create index if not exists analytics_visits_created_at_idx
        on analytics_visits (created_at desc)
    `);

    await this.pool.query(`
      create index if not exists analytics_visits_path_idx
        on analytics_visits (path)
    `);

    await this.pool.query(`
      create index if not exists analytics_visits_visitor_idx
        on analytics_visits (visitor_id)
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
    const parsedAgent = this.parseUserAgent(userAgent);
    const visit: Visit = {
      ...payload,
      id: crypto.randomUUID(),
      ipAddress,
      userAgent,
      browser: parsedAgent.browser,
      operatingSystem: parsedAgent.operatingSystem,
      deviceType: parsedAgent.deviceType,
      createdAt: new Date().toISOString(),
    };

    if (this.pool) {
      await this.pool.query(
        `
          insert into analytics_visits (
            id,
            event,
            visitor_id,
            session_id,
            path,
            url,
            title,
            referrer,
            screen,
            viewport,
            device_pixel_ratio,
            connection_type,
            language,
            timezone,
            utm_source,
            utm_medium,
            utm_campaign,
            duration_ms,
            max_scroll_depth,
            ip_address,
            user_agent,
            browser,
            operating_system,
            device_type,
            created_at
          )
          values (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
            $11, $12, $13, $14, $15, $16, $17, $18,
            $19, $20::inet, $21, $22, $23, $24, $25
          )
        `,
        [
          visit.id,
          visit.event,
          visit.visitorId ?? null,
          visit.sessionId ?? null,
          visit.path,
          visit.url ?? null,
          visit.title,
          visit.referrer ?? null,
          visit.screen ?? null,
          visit.viewport ?? null,
          visit.devicePixelRatio ?? null,
          visit.connectionType ?? null,
          visit.language ?? null,
          visit.timezone ?? null,
          visit.utmSource ?? null,
          visit.utmMedium ?? null,
          visit.utmCampaign ?? null,
          visit.durationMs ?? null,
          visit.maxScrollDepth ?? null,
          visit.ipAddress,
          visit.userAgent,
          visit.browser,
          visit.operatingSystem,
          visit.deviceType,
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

    const visitorKey =
      "coalesce(visitor_id, coalesce(ip_address::text, 'unknown') || '|' || coalesce(user_agent, ''))";
    const sessionKey = "coalesce(session_id, " + visitorKey + ")";

    const [
      summary,
      daily,
      topPages,
      referrers,
      campaigns,
      devices,
      browsers,
      countries,
      recent,
    ] = await Promise.all([
      this.pool.query<SummaryRow>(`
        select
          count(*) as total_events,
          count(*) filter (where event = 'page_view') as total_views,
          count(distinct ${visitorKey}) as unique_visitors,
          count(distinct ${sessionKey}) as sessions,
          min(created_at) as first_seen,
          max(created_at) as last_seen,
          avg(duration_ms) filter (where event = 'engagement' and duration_ms is not null) as avg_duration_ms,
          avg(max_scroll_depth) filter (where event = 'engagement' and max_scroll_depth is not null) as avg_scroll_depth
        from analytics_visits
      `),
      this.pool.query<DailyRow>(`
        select
          date_trunc('day', created_at)::date::text as day,
          count(*) filter (where event = 'page_view') as views,
          count(distinct ${visitorKey}) as unique_visitors,
          count(distinct ${sessionKey}) as sessions
        from analytics_visits
        where created_at >= now() - interval '30 days'
        group by day
        order by day desc
      `),
      this.pool.query<MetricRow>(`
        select path as label, count(*) as views
        from analytics_visits
        where event = 'page_view'
          and created_at >= now() - interval '30 days'
        group by path
        order by views desc, path asc
        limit 20
      `),
      this.pool.query<MetricRow>(`
        select coalesce(nullif(referrer, ''), 'Direct / unknown') as label, count(*) as views
        from analytics_visits
        where event = 'page_view'
          and created_at >= now() - interval '30 days'
        group by label
        order by views desc, label asc
        limit 12
      `),
      this.pool.query<MetricRow>(`
        select coalesce(nullif(utm_campaign, ''), nullif(utm_source, ''), 'No campaign') as label, count(*) as views
        from analytics_visits
        where event = 'page_view'
          and created_at >= now() - interval '30 days'
        group by label
        order by views desc, label asc
        limit 12
      `),
      this.pool.query<MetricRow>(`
        select coalesce(nullif(device_type, ''), 'Unknown') as label, count(*) as views
        from analytics_visits
        where event = 'page_view'
          and created_at >= now() - interval '30 days'
        group by label
        order by views desc, label asc
      `),
      this.pool.query<MetricRow>(`
        select coalesce(nullif(browser, ''), 'Unknown') as label, count(*) as views
        from analytics_visits
        where event = 'page_view'
          and created_at >= now() - interval '30 days'
        group by label
        order by views desc, label asc
        limit 10
      `),
      this.pool.query<MetricRow>(`
        select coalesce(nullif(timezone, ''), 'Unknown timezone') as label, count(*) as views
        from analytics_visits
        where event = 'page_view'
          and created_at >= now() - interval '30 days'
        group by label
        order by views desc, label asc
        limit 10
      `),
      this.pool.query<VisitRow>(`
        select
          id,
          event,
          visitor_id,
          session_id,
          path,
          url,
          title,
          referrer,
          screen,
          viewport,
          device_pixel_ratio::text as device_pixel_ratio,
          connection_type,
          language,
          timezone,
          utm_source,
          utm_medium,
          utm_campaign,
          duration_ms,
          max_scroll_depth,
          ip_address::text as ip_address,
          user_agent,
          browser,
          operating_system,
          device_type,
          created_at
        from analytics_visits
        order by created_at desc
        limit 80
      `),
    ]);

    const totals = summary.rows[0];

    return {
      totalEvents: Number(totals?.total_events ?? 0),
      totalViews: Number(totals?.total_views ?? 0),
      uniqueVisitors: Number(totals?.unique_visitors ?? 0),
      sessions: Number(totals?.sessions ?? 0),
      firstSeen: totals?.first_seen ?? null,
      lastSeen: totals?.last_seen ?? null,
      avgDurationMs: Math.round(Number(totals?.avg_duration_ms ?? 0)),
      avgScrollDepth: Math.round(Number(totals?.avg_scroll_depth ?? 0)),
      last30Days: daily.rows.map((row) => ({
        day: row.day,
        views: Number(row.views),
        uniqueVisitors: Number(row.unique_visitors),
        sessions: Number(row.sessions),
      })),
      topPages: this.mapMetricRows(topPages.rows),
      referrers: this.mapMetricRows(referrers.rows),
      campaigns: this.mapMetricRows(campaigns.rows),
      devices: this.mapMetricRows(devices.rows),
      browsers: this.mapMetricRows(browsers.rows),
      timezones: this.mapMetricRows(countries.rows),
      recentVisits: recent.rows.map((row) => this.mapVisitRow(row)),
    };
  }

  private async addColumnIfMissing(name: string, type: string) {
    if (!this.pool) {
      return;
    }

    await this.pool.query(`
      alter table analytics_visits
      add column if not exists ${name} ${type}
    `);
  }

  private memorySummary() {
    const visitors = new Set(
      this.visits.map(
        (visit) =>
          `${visit.visitorId ?? visit.ipAddress ?? 'unknown'}|${visit.userAgent ?? ''}`,
      ),
    );
    const sessions = new Set(
      this.visits.map((visit) => visit.sessionId ?? visit.visitorId ?? visit.id),
    );
    const pageCounts = this.visits.reduce<Record<string, number>>(
      (counts, visit) => {
        if (visit.event === 'page_view') {
          counts[visit.path] = (counts[visit.path] ?? 0) + 1;
        }
        return counts;
      },
      {},
    );
    const engagement = this.visits.filter((visit) => visit.event === 'engagement');
    const avgDurationMs = this.average(engagement.map((visit) => visit.durationMs));
    const avgScrollDepth = this.average(
      engagement.map((visit) => visit.maxScrollDepth),
    );

    return {
      totalEvents: this.visits.length,
      totalViews: this.visits.filter((visit) => visit.event === 'page_view').length,
      uniqueVisitors: visitors.size,
      sessions: sessions.size,
      firstSeen: this.visits.at(-1)?.createdAt ?? null,
      lastSeen: this.visits[0]?.createdAt ?? null,
      avgDurationMs,
      avgScrollDepth,
      last30Days: [],
      topPages: Object.entries(pageCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([label, views]) => ({ label, views })),
      referrers: [],
      campaigns: [],
      devices: [],
      browsers: [],
      timezones: [],
      recentVisits: this.visits.slice(0, 80),
    };
  }

  private mapMetricRows(rows: MetricRow[]) {
    return rows.map((row) => ({
      label: row.label ?? 'Unknown',
      views: Number(row.views),
    }));
  }

  private mapVisitRow(row: VisitRow): Visit {
    return {
      id: row.id,
      event: row.event,
      visitorId: row.visitor_id ?? undefined,
      sessionId: row.session_id ?? undefined,
      path: row.path,
      url: row.url ?? undefined,
      title: row.title,
      referrer: row.referrer ?? undefined,
      screen: row.screen ?? undefined,
      viewport: row.viewport ?? undefined,
      devicePixelRatio: row.device_pixel_ratio
        ? Number(row.device_pixel_ratio)
        : undefined,
      connectionType: row.connection_type ?? undefined,
      language: row.language ?? undefined,
      timezone: row.timezone ?? undefined,
      utmSource: row.utm_source ?? undefined,
      utmMedium: row.utm_medium ?? undefined,
      utmCampaign: row.utm_campaign ?? undefined,
      durationMs: row.duration_ms ?? undefined,
      maxScrollDepth: row.max_scroll_depth ?? undefined,
      ipAddress: row.ip_address,
      userAgent: row.user_agent,
      browser: row.browser ?? 'Unknown',
      operatingSystem: row.operating_system ?? 'Unknown',
      deviceType: row.device_type ?? 'Unknown',
      createdAt: row.created_at,
    };
  }

  private parseUserAgent(userAgent: string | null) {
    const value = userAgent ?? '';
    const lower = value.toLowerCase();

    const browser = lower.includes('edg/')
      ? 'Edge'
      : lower.includes('chrome/')
        ? 'Chrome'
        : lower.includes('safari/') && !lower.includes('chrome/')
          ? 'Safari'
          : lower.includes('firefox/')
            ? 'Firefox'
            : lower.includes('opr/') || lower.includes('opera')
              ? 'Opera'
              : 'Unknown';

    const operatingSystem = lower.includes('iphone') || lower.includes('ipad')
      ? 'iOS'
      : lower.includes('android')
        ? 'Android'
        : lower.includes('mac os x')
          ? 'macOS'
          : lower.includes('windows')
            ? 'Windows'
            : lower.includes('linux')
              ? 'Linux'
              : 'Unknown';

    const deviceType = lower.includes('tablet') || lower.includes('ipad')
      ? 'Tablet'
      : lower.includes('mobile') ||
          lower.includes('iphone') ||
          lower.includes('android')
        ? 'Mobile'
        : 'Desktop';

    return { browser, operatingSystem, deviceType };
  }

  private average(values: Array<number | undefined>) {
    const cleanValues = values.filter((value): value is number =>
      Number.isFinite(value),
    );

    if (cleanValues.length === 0) {
      return 0;
    }

    return Math.round(
      cleanValues.reduce((total, value) => total + value, 0) /
        cleanValues.length,
    );
  }
}
