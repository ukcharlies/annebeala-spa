import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateVisitDto {
  @IsIn(['page_view'])
  event!: 'page_view';

  @IsString()
  @MaxLength(2048)
  path!: string;

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
  @MaxLength(64)
  language?: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  timezone?: string;
}
