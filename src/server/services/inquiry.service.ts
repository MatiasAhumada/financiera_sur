import { inquiryRepository } from "@/server/repository/inquiry.repository";
import { notifyInquiry } from "@/server/services/notification.service";

export const inquiryService = {
  async create(data: { name: string; email: string; phone: string; message?: string; productId?: string }) {
    const inquiry = await inquiryRepository.create({ ...data, consentAt: new Date() });
    void notifyInquiry(inquiry);
    return inquiry;
  },
  findAll() { return inquiryRepository.findAll(); },
};
