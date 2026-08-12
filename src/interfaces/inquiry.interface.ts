export interface InquiryProductReference {
  name: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  notificationStatus: string;
  createdAt: string;
  product?: InquiryProductReference | null;
}
