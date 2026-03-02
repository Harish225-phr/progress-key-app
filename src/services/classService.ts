import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

interface ClassData {
  name: string;
}

interface ClassResponse {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

// Add a new class
export const addClass = async (classData: ClassData): Promise<ClassResponse> => {
  return apiClient.post<ClassResponse>(API_ENDPOINTS.classes.base, classData);
};

// Get all classes
export const getClasses = async (): Promise<ClassResponse[]> => {
  return apiClient.get<ClassResponse[]>(API_ENDPOINTS.classes.base);
};

// Get class by ID
export const getClassById = async (classId: string): Promise<ClassResponse> => {
  return apiClient.get<ClassResponse>(API_ENDPOINTS.classes.byId(classId));
};

// Update class
export const updateClass = async (classId: string, classData: ClassData): Promise<ClassResponse> => {
  return apiClient.put<ClassResponse>(API_ENDPOINTS.classes.byId(classId), classData);
};

// Delete class
export const deleteClass = async (classId: string): Promise<void> => {
  await apiClient.delete<void>(API_ENDPOINTS.classes.byId(classId));
};
