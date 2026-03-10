import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { InquiriesService } from './inquiries.service';

@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Post()
  create(@Body() payload: CreateInquiryDto) {
    return this.inquiriesService.create(payload);
  }

  @Get()
  list() {
    return this.inquiriesService.list();
  }
}
