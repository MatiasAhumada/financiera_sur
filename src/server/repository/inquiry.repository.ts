import { prisma } from "@/lib/prisma";

export const inquiryRepository = {
  create(data: { name: string; email: string; phone: string; message?: string; productId?: string; consentAt: Date }) {
    return prisma.inquiry.create({ data, include: { product: true } });
  },
  findAll() {
    return prisma.inquiry.findMany({ include: { product: true }, orderBy: { createdAt: "desc" } });
  },
  updateNotification(id: string, data: { status: "SENT" | "FAILED"; error?: string }) {
    return prisma.inquiry.update({ where: { id }, data: { notificationStatus: data.status, lastNotificationError: data.error, notificationAttempts: { increment: 1 } } });
  },
};
