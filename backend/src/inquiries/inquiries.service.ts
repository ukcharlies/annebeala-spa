import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Pool } from 'pg';
import { CreateInquiryDto } from './dto/create-inquiry.dto';

export type Inquiry = CreateInquiryDto & {
  id: string;
  createdAt: string;
};

@Injectable()
export class InquiriesService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(InquiriesService.name);
  private inquiries: Inquiry[] = [];
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
        'DATABASE_URL is not set. Inquiries will stay in memory until a database is configured.',
      );
      return;
    }

    await this.pool.query(`
      create table if not exists inquiries (
        id text primary key,
        full_name text not null,
        phone text not null,
        email text,
        interest text not null,
        preferred_date text,
        message text not null,
        source text not null,
        created_at timestamptz not null
      )
    `);
  }

  async onModuleDestroy() {
    await this.pool?.end();
  }

  async create(payload: CreateInquiryDto): Promise<Inquiry> {
    const inquiry: Inquiry = {
      ...payload,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    if (this.pool) {
      await this.pool.query(
        `
          insert into inquiries (
            id,
            full_name,
            phone,
            email,
            interest,
            preferred_date,
            message,
            source,
            created_at
          )
          values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `,
        [
          inquiry.id,
          inquiry.fullName,
          inquiry.phone,
          inquiry.email ?? null,
          inquiry.interest,
          inquiry.preferredDate ?? null,
          inquiry.message,
          inquiry.source,
          inquiry.createdAt,
        ],
      );

      return inquiry;
    }

    this.inquiries.unshift(inquiry);
    return inquiry;
  }

  async list(): Promise<Inquiry[]> {
    if (!this.pool) {
      return this.inquiries;
    }

    const result = await this.pool.query<{
      id: string;
      full_name: string;
      phone: string;
      email: string | null;
      interest: string;
      preferred_date: string | null;
      message: string;
      source: 'contact' | 'booking';
      created_at: string;
    }>(
      `
        select
          id,
          full_name,
          phone,
          email,
          interest,
          preferred_date,
          message,
          source,
          created_at
        from inquiries
        order by created_at desc
      `,
    );

    return result.rows.map((row) => ({
      id: row.id,
      fullName: row.full_name,
      phone: row.phone,
      email: row.email ?? undefined,
      interest: row.interest,
      preferredDate: row.preferred_date ?? undefined,
      message: row.message,
      source: row.source,
      createdAt: row.created_at,
    }));
  }
}
