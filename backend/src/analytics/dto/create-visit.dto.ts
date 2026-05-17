import {
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateVisitDto {
  @IsIn(['page_view', 'engagement'])
  event!: 'page_view' | 'engagement';

  @IsOptional()
  @IsString()
  @MaxLength(80)
  visitorId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  sessionId?: string;

  @IsString()
  @MaxLength(2048)
  path!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  url?: string;

  @IsString()
  @MaxLength(300)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  referrer?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  screen?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  viewport?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  devicePixelRatio?: number;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  connectionType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  language?: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  timezone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  utmSource?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  utmMedium?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  utmCampaign?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(24 * 60 * 60 * 1000)
  durationMs?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  maxScrollDepth?: number;
}
