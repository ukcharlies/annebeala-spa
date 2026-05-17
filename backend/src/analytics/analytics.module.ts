import { Module } from '@nestjs/common';
import { AnalyticsController, TrafficController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
  controllers: [AnalyticsController, TrafficController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
