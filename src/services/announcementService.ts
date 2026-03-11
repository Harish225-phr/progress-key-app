import { apiClient } from "@/api/client";

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  type: "general" | "academic" | "fees" | "event" | "urgent";
  priority: "low" | "medium" | "high" | "urgent";
  targetAudience: string[];
  targetClasses: Array<{
    _id: string;
    name: string;
  }>;
  targetSections: Array<{
    _id: string;
    name: string;
  }>;
  targetUsers: Array<{
    _id: string;
    name: string;
    email: string;
    role: string;
  }>;
  expiryDate: string;
  scheduledDate: string;
  deliveryMethods: {
    email: boolean;
    sms: boolean;
    push: boolean;
    portal: boolean;
  };
  tags: string[];
  allowComments: boolean;
  isPinned: boolean;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  readBy: Array<{
    userId: string;
    readAt: string;
  }>;
  comments: Array<{
    _id: string;
    userId: string;
    userName: string;
    content: string;
    createdAt: string;
  }>;
  attachments: Array<{
    _id: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
  }>;
}

export interface CreateAnnouncementData {
  title: string;
  content: string;
  type: "general" | "academic" | "fees" | "event" | "urgent";
  priority: "low" | "medium" | "high" | "urgent";
  targetAudience: string[];
  targetClasses: Array<{
    _id: string;
    name: string;
  }>;
  targetSections: Array<{
    _id: string;
    name: string;
  }>;
  targetUsers: Array<{
    _id: string;
    name: string;
    email: string;
    role: string;
  }>;
  expiryDate: string;
  scheduledDate: string;
  deliveryMethods: {
    email: boolean;
    sms: boolean;
    push: boolean;
    portal: boolean;
  };
  tags: string[];
  allowComments: boolean;
  isPinned: boolean;
}

export interface AnnouncementStats {
  total: number;
  active: number;
  expired: number;
  scheduled: number;
  byType: {
    general: number;
    academic: number;
    fees: number;
    event: number;
    urgent: number;
  };
  byPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  readStats: {
    totalReads: number;
    totalViews: number;
    averageReadRate: number;
  };
  recentActivity: Array<{
    date: string;
    announcements: number;
    reads: number;
  }>;
}

export const announcementService = {
  // Create announcement
  createAnnouncement: async (data: CreateAnnouncementData): Promise<Announcement> => {
    const response = await apiClient.post<Announcement>("announcements", data);
    return response;
  },

  // Get all announcements
  getAllAnnouncements: async (filters?: {
    type?: string;
    priority?: string;
    status?: "all" | "active" | "expired" | "scheduled";
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: Announcement[];
    total: number;
    page: number;
    pages: number;
  }> => {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (key === "status") {
          return;
        }

        // Only add filter if it has a meaningful value (not "all" or empty)
        if (value !== undefined && value !== "" && value !== "all") {
          queryParams.append(key, String(value));
        }
      });
    }

    queryParams.append("status", filters?.status || "all");

    // API returns: { success, count, total, page, pages, data: [...] }
    // We need to use getRaw to get the full response and handle it properly
    const response = await apiClient.getRaw<{
      success: boolean;
      count: number;
      total: number;
      page: number;
      pages: number;
      data: Announcement[];
    }>(`announcements?${queryParams.toString()}`);
    
    return {
      data: response.data || [],
      total: response.total || 0,
      page: response.page || 1,
      pages: response.pages || 1,
    };
  },

  // Get user's announcements
  getMyAnnouncements: async (filters?: {
    type?: string;
    priority?: string;
    unreadOnly?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{
    announcements: Announcement[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    const response = await apiClient.get<{
      announcements: Announcement[];
      total: number;
      page: number;
      totalPages: number;
    }>(`announcements/my?${queryParams}`);
    return response;
  },

  // Get announcement statistics
  getAnnouncementStats: async (): Promise<AnnouncementStats> => {
    const response = await apiClient.get<AnnouncementStats>("announcements/stats");
    return response;
  },

  // Get single announcement
  getAnnouncementById: async (id: string): Promise<Announcement> => {
    const response = await apiClient.get<Announcement>(`announcements/${id}`);
    return response;
  },

  // Update announcement
  updateAnnouncement: async (id: string, data: Partial<CreateAnnouncementData>): Promise<Announcement> => {
    const response = await apiClient.put<Announcement>(`announcements/${id}`, data);
    return response;
  },

  // Delete announcement
  deleteAnnouncement: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`announcements/${id}`);
    return response;
  },

  // Mark announcement as read
  markAsRead: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post<{ success: boolean; message: string }>(`announcements/${id}/read`);
    return response;
  },

  // Add comment to announcement
  addComment: async (id: string, comment: string): Promise<{
    success: boolean;
    message: string;
    comment: {
      _id: string;
      userId: string;
      userName: string;
      content: string;
      createdAt: string;
    };
  }> => {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      comment: {
        _id: string;
        userId: string;
        userName: string;
        content: string;
        createdAt: string;
      };
    }>(`announcements/${id}/comments`, { content: comment });
    return response;
  },

  // Delete comment
  deleteComment: async (announcementId: string, commentId: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`announcements/${announcementId}/comments/${commentId}`);
    return response;
  },

  // Pin/Unpin announcement
  togglePin: async (id: string): Promise<Announcement> => {
    const response = await apiClient.put<Announcement>(`announcements/${id}/pin`);
    return response;
  },

  // Get announcement read receipts
  getReadReceipts: async (id: string): Promise<Array<{
    userId: string;
    userName: string;
    email: string;
    readAt: string;
  }>> => {
    const response = await apiClient.get<Array<{
      userId: string;
      userName: string;
      email: string;
      readAt: string;
    }>>(`announcements/${id}/read-receipts`);
    return response;
  },

  // Schedule announcement
  scheduleAnnouncement: async (id: string, scheduledDate: string): Promise<Announcement> => {
    const response = await apiClient.put<Announcement>(`announcements/${id}/schedule`, { scheduledDate });
    return response;
  },

  // Send announcement immediately
  sendAnnouncement: async (id: string): Promise<{ success: boolean; message: string; sentCount: number }> => {
    const response = await apiClient.post<{ success: boolean; message: string; sentCount: number }>(`announcements/${id}/send`);
    return response;
  },

  // Duplicate announcement
  duplicateAnnouncement: async (id: string): Promise<Announcement> => {
    const response = await apiClient.post<Announcement>(`announcements/${id}/duplicate`);
    return response;
  },

  // Archive announcement
  archiveAnnouncement: async (id: string): Promise<Announcement> => {
    const response = await apiClient.put<Announcement>(`announcements/${id}/archive`);
    return response;
  },

  // Get archived announcements
  getArchivedAnnouncements: async (filters?: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    announcements: Announcement[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    const response = await apiClient.get<{
      announcements: Announcement[];
      total: number;
      page: number;
      totalPages: number;
    }>(`announcements/archived?${queryParams}`);
    return response;
  },

  // Restore archived announcement
  restoreAnnouncement: async (id: string): Promise<Announcement> => {
    const response = await apiClient.put<Announcement>(`announcements/${id}/restore`);
    return response;
  }
};
