import React from "react";
import { useAnnouncements } from "@/hooks/useAnnouncements";

interface AnnouncementsListProps {
  type?: string;
  priority?: string;
  status?: string;
  search?: string;
}

export const AnnouncementsList: React.FC<AnnouncementsListProps> = ({
  type = "all",
  priority = "all",
  status = "all",
  search = "",
}) => {
  const { announcements, loading, error, pagination } = useAnnouncements({
    type,
    priority,
    status,
    search,
  });

  if (loading) {
    return <div className="p-4">Loading announcements...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (announcements.length === 0) {
    return <div className="p-4 text-gray-500">No announcements found.</div>;
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Announcements</h2>
        <p className="text-sm text-gray-600">
          Showing {pagination.count} of {pagination.total} announcements
        </p>
      </div>

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-medium">{announcement.title}</h3>
              <div className="flex gap-2">
                <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                  {announcement.type}
                </span>
                <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800">
                  {announcement.priority}
                </span>
                <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                  {announcement.status}
                </span>
              </div>
            </div>
            
            <p className="text-gray-700 mb-3">{announcement.content}</p>
            
            <div className="flex justify-between items-center text-sm text-gray-500">
              <div className="flex gap-4">
                <span>Created: {new Date(announcement.createdAt).toLocaleDateString()}</span>
                <span>Updated: {new Date(announcement.updatedAt).toLocaleDateString()}</span>
              </div>
              
              <div className="flex gap-2">
                {announcement.deliveryMethods.email && (
                  <span className="px-2 py-1 bg-gray-100 rounded">Email</span>
                )}
                {announcement.deliveryMethods.sms && (
                  <span className="px-2 py-1 bg-gray-100 rounded">SMS</span>
                )}
                {announcement.deliveryMethods.push && (
                  <span className="px-2 py-1 bg-gray-100 rounded">Push</span>
                )}
                {announcement.deliveryMethods.dashboard && (
                  <span className="px-2 py-1 bg-gray-100 rounded">Dashboard</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
