import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { AnalyticsService } from './analytics.service';
import { CreateVisitDto } from './dto/create-visit.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('visit')
  @HttpCode(204)
  async recordVisit(
    @Body() payload: CreateVisitDto,
    @Req() request: Request,
    @Headers('cf-connecting-ip') cloudflareIp?: string,
    @Headers('x-real-ip') realIp?: string,
    @Headers('x-forwarded-for') forwardedFor?: string,
    @Headers('user-agent') userAgent?: string,
  ) {
    const ipAddress =
      this.analyticsService.normalizeIpAddress(cloudflareIp) ??
      this.analyticsService.normalizeIpAddress(realIp) ??
      this.analyticsService.normalizeIpAddress(forwardedFor) ??
      this.analyticsService.normalizeIpAddress(request.ip) ??
      this.analyticsService.normalizeIpAddress(request.socket.remoteAddress);

    await this.analyticsService.recordVisit(
      payload,
      ipAddress,
      userAgent ?? null,
    );
  }

  @Get('summary')
  async summary(@Headers('authorization') authorization?: string) {
    this.assertAuthorized(authorization);
    return this.analyticsService.summary();
  }

  private assertAuthorized(authorization?: string) {
    const token = process.env.ANALYTICS_ADMIN_TOKEN;
    const provided = authorization?.replace(/^Bearer\s+/i, '').trim();

    if (!token || !provided || provided !== token) {
      throw new UnauthorizedException('Analytics admin token is required.');
    }
  }
}
