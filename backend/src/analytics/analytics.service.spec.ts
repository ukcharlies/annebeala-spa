import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  const originalDatabaseUrl = process.env.DATABASE_URL;

  beforeEach(() => {
    delete process.env.DATABASE_URL;
  });

  afterAll(() => {
    process.env.DATABASE_URL = originalDatabaseUrl;
  });

  it('averages the latest useful engagement snapshot per session and page', async () => {
    const service = new AnalyticsService();

    await service.recordVisit(
      {
        event: 'page_view',
        visitorId: 'visitor-1',
        sessionId: 'session-1',
        path: '/',
        title: 'Home',
      },
      '127.0.0.1',
      'Chrome',
    );

    await service.recordVisit(
      {
        event: 'engagement',
        visitorId: 'visitor-1',
        sessionId: 'session-1',
        path: '/',
        title: 'Home',
        durationMs: 0,
        maxScrollDepth: 10,
      },
      '127.0.0.1',
      'Chrome',
    );

    await service.recordVisit(
      {
        event: 'engagement',
        visitorId: 'visitor-1',
        sessionId: 'session-1',
        path: '/',
        title: 'Home',
        durationMs: 15_000,
        maxScrollDepth: 80,
      },
      '127.0.0.1',
      'Chrome',
    );

    await service.recordVisit(
      {
        event: 'engagement',
        visitorId: 'visitor-1',
        sessionId: 'session-1',
        path: '/',
        title: 'Home',
        durationMs: 30_000,
        maxScrollDepth: 100,
      },
      '127.0.0.1',
      'Chrome',
    );

    const summary = await service.summary();

    expect(summary.avgDurationMs).toBe(30_000);
    expect(summary.avgScrollDepth).toBe(100);
  });
});
