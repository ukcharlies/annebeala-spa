import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateInquiryDto {
  @IsString()
  @Length(2, 80)
  fullName: string;

  @IsString()
  @Matches(/^[+0-9\s()-]{7,20}$/)
  phone: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @Length(2, 120)
  interest: string;

  @IsOptional()
  @IsString()
  preferredDate?: string;

  @IsString()
  @Length(5, 1000)
  message: string;

  @IsIn(['contact', 'booking'])
  source: 'contact' | 'booking';
}
