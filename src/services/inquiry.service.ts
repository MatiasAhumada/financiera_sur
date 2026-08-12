import clientAxios from "@/utils/clientAxios.util";
import type { InquiryListResponse, UpdateInquiryInput } from "@/interfaces/inquiry.interface";
import { API_ROUTES } from "@/constants/routes";
export const inquiryClientService = {
  create(data: { name: string; email: string; phone: string; message?: string; productId?: string; website?: string }) { return clientAxios.post<{ id: string }>(API_ROUTES.INQUIRIES, data); },
  list() { return clientAxios.get<InquiryListResponse>(API_ROUTES.ADMIN.INQUIRIES); },
  markAllAsRead() { return clientAxios.patch(API_ROUTES.ADMIN.INQUIRIES, { markAllAsRead: true }); },
  update(id: string, data: UpdateInquiryInput) { return clientAxios.patch(API_ROUTES.ADMIN.INQUIRY(id), data); },
};
