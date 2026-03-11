import { apiClient } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import type { Announcement, AnnouncementsResponse, AnnouncementsQueryParams } from "./types";

export const announcementsApi = {
  /**
   * Get announcements with optional filtering
   * @param params - Query parameters for filtering announcements
   * @returns Promise<AnnouncementsResponse>
   */
  getAnnouncements: async (params: AnnouncementsQueryParams = {}): Promise<AnnouncementsResponse> => {
    const searchParams = new URLSearchParams();
    
    // Add query parameters if they exist
    if (params.type) searchParams.append("type", params.type);
    if (params.priority) searchParams.append("priority", params.priority);
    if (params.status) searchParams.append("status", params.status);
    if (params.search) searchParams.append("search", params.search);
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());

    const queryString = searchParams.toString();
    const endpoint = queryString 
      ? `${API_ENDPOINTS.announcements.base}?${queryString}`
      : API_ENDPOINTS.announcements.base;

    console.log('Making API call to:', endpoint);
    // Use getRaw to get the full response without unwrapping
    const response = await apiClient.getRaw<AnnouncementsResponse>(endpoint);
    console.log('Raw API response:', response);
    return response;
  },

  /**
   * Get a single announcement by ID
   * @param id - Announcement ID
   * @returns Promise<Announcement>
   */
  getAnnouncementById: async (id: string): Promise<Announcement> => {
    return apiClient.get<Announcement>(`${API_ENDPOINTS.announcements.base}/${id}`);
  },

  /**
   * Create a new announcement
   * @param announcement - Announcement data to create
   * @returns Promise<Announcement>
   */
  createAnnouncement: async (announcement: Partial<Announcement>): Promise<Announcement> => {
    return apiClient.post<Announcement>(API_ENDPOINTS.announcements.base, announcement);
  },

  /**
   * Update an existing announcement
   * @param id - Announcement ID
   * @param announcement - Updated announcement data
   * @returns Promise<Announcement>
   */
  updateAnnouncement: async (id: string, announcement: Partial<Announcement>): Promise<Announcement> => {
    return apiClient.put<Announcement>(`${API_ENDPOINTS.announcements.base}/${id}`, announcement);
  },

  /**
   * Delete an announcement
   * @param id - Announcement ID
   * @returns Promise<void>
   */
  deleteAnnouncement: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`${API_ENDPOINTS.announcements.base}/${id}`);
  },
};
