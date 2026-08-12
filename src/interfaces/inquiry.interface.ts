export interface InquiryProductReference {
  name: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: InquiryStatus;
  isRead: boolean;
  notificationStatus: string;
  createdAt: string;
  product?: InquiryProductReference | null;
}

export type InquiryStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "CLOSED" | "LOST";
export interface InquiryListResponse { items: Inquiry[]; unreadCount: number; }
export interface UpdateInquiryInput { status?: InquiryStatus; isRead?: boolean; }
