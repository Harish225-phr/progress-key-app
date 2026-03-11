import { useState, useEffect } from "react";
import { announcementsApi } from "@/api/announcements";
import type { Announcement, AnnouncementsResponse, AnnouncementsQueryParams } from "@/api/types";

export const useAnnouncements = (params: AnnouncementsQueryParams = {}) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    count: 0,
    total: 0,
    page: 1,
    pages: 1,
  });

  const fetchAnnouncements = async (queryParams: AnnouncementsQueryParams = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching announcements with params:', { ...params, ...queryParams });
      const response = await announcementsApi.getAnnouncements({ ...params, ...queryParams });
      console.log('API Response:', response);
      setAnnouncements(response.data);
      setPagination({
        count: response.count,
        total: response.total,
        page: response.page,
        pages: response.pages,
      });
    } catch (err) {
      console.error('Error fetching announcements:', err);
      setError(err instanceof Error ? err.message : "Failed to fetch announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const refetch = (newParams?: AnnouncementsQueryParams) => {
    fetchAnnouncements(newParams);
  };

  return {
    announcements,
    loading,
    error,
    pagination,
    refetch,
  };
};
