import { Injectable } from '@nestjs/common';
import { CreateInquiryDto } from './dto/create-inquiry.dto';

export type Inquiry = CreateInquiryDto & {
  id: string;
  createdAt: string;
};

@Injectable()
export class InquiriesService {
  private inquiries: Inquiry[] = [];

  create(payload: CreateInquiryDto): Inquiry {
    const inquiry: Inquiry = {
      ...payload,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    this.inquiries.unshift(inquiry);
    return inquiry;
  }

  list(): Inquiry[] {
    return this.inquiries;
  }
}
