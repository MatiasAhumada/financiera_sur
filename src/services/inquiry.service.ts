import clientAxios from "@/utils/clientAxios.util";
import type { InquiryListResponse, UpdateInquiryInput } from "@/interfaces/inquiry.interface";
export const inquiryClientService = {
  create(data: { name: string; email: string; phone: string; message?: string; productId?: string; website?: string }) { return clientAxios.post<{ id: string }>("/api/inquiries", data); },
  list() { return clientAxios.get<InquiryListResponse>("/api/admin/inquiries"); },
  markAllAsRead() { return clientAxios.patch("/api/admin/inquiries", { markAllAsRead: true }); },
  update(id: string, data: UpdateInquiryInput) { return clientAxios.patch(`/api/admin/inquiries/${id}`, data); },
};
