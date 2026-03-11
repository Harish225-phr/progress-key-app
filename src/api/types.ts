export interface DeliveryMethods {
  email: boolean;
  sms: boolean;
  push: boolean;
  dashboard: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string;
  priority: string;
  status: string;
  deliveryMethods: DeliveryMethods;
  createdAt: string;
  updatedAt: string;
  // Add any other fields that your API returns
}

export interface AnnouncementsResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: Announcement[];
}

export interface AnnouncementsQueryParams {
  type?: string;
  priority?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}
