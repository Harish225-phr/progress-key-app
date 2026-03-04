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

type ClassApiResponse = {
  id?: string;
  _id?: string;
  classId?: string;
  name?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
};

interface SectionData {
  name: string;
  classId: string;
  classTeacher: string;
}

interface SectionResponse {
  id: string;
  name: string;
  classId: string;
  classTeacher: string;
}

const normalizeClass = (item: ClassApiResponse): ClassResponse => {
  const normalizedId = item.id ?? item._id ?? item.classId;

  if (!normalizedId) {
    throw new Error("Class id is missing in API response");
  }

  return {
    id: String(normalizedId),
    name: item.name ?? "",
    createdAt: item.createdAt ?? item.created_at,
    updatedAt: item.updatedAt ?? item.updated_at,
  };
};

// Add a new class
export const addClass = async (classData: ClassData): Promise<ClassResponse> => {
  const response = await apiClient.post<ClassApiResponse>(API_ENDPOINTS.classes.base, classData);
  return normalizeClass(response);
};

// Get all classes
export const getClasses = async (): Promise<ClassResponse[]> => {
  const response = await apiClient.get<ClassApiResponse[]>(API_ENDPOINTS.classes.base);
  return response
    .map((item) => {
      try {
        return normalizeClass(item);
      } catch {
        return null;
      }
    })
    .filter((item): item is ClassResponse => item !== null);
};

// Get class by ID
export const getClassById = async (classId: string): Promise<ClassResponse> => {
  const response = await apiClient.get<ClassApiResponse>(API_ENDPOINTS.classes.byId(classId));
  return normalizeClass(response);
};

// Update class
export const updateClass = async (classId: string, classData: ClassData): Promise<ClassResponse> => {
  const response = await apiClient.put<ClassApiResponse>(API_ENDPOINTS.classes.byId(classId), classData);
  return normalizeClass(response);
};

// Delete class
export const deleteClass = async (classId: string): Promise<void> => {
  await apiClient.delete<void>(API_ENDPOINTS.classes.byId(classId));
};

// Add a new section
export const addSection = async (sectionData: SectionData): Promise<SectionResponse> => {
  return apiClient.post<SectionResponse>(API_ENDPOINTS.sections.base, sectionData);
};
