import { inquiryRepository } from "@/server/repository/inquiry.repository";
import { notifyInquiry } from "@/server/services/notification.service";

export const inquiryService = {
  async create(data: { name: string; email: string; phone: string; message?: string; productId?: string }) {
    const inquiry = await inquiryRepository.create({ ...data, consentAt: new Date() });
    void notifyInquiry(inquiry);
    return inquiry;
  },
  findAll() { return inquiryRepository.findAll(); },
  async list() {
    const [items, unreadCount] = await Promise.all([inquiryRepository.findAll(), inquiryRepository.countUnread()]);
    return { items, unreadCount };
  },
  markAllAsRead() { return inquiryRepository.markAllAsRead(); },
  update(id: string, data: { status?: "NEW" | "CONTACTED" | "QUALIFIED" | "CLOSED" | "LOST"; isRead?: boolean }) { return inquiryRepository.update(id, data); },
};
