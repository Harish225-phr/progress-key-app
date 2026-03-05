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

export interface SectionResponse {
  id: string;
  name: string;
  classId: string;
  className?: string;
  classTeacher: string;
  classTeacherName?: string;
  createdAt?: string;
}

type PopulatedRef = {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
} | string;

type SectionApiResponse = {
  id?: string;
  _id?: string;
  name?: string;
  classId?: PopulatedRef;
  classTeacher?: PopulatedRef;
  createdAt?: string;
  updatedAt?: string;
};

type SectionsListResponse = {
  success?: boolean;
  data?: SectionApiResponse[];
} | SectionApiResponse[];

const extractIdFromRef = (ref: PopulatedRef | undefined): string => {
  if (!ref) return "";
  if (typeof ref === "string") return ref;
  return String(ref._id ?? ref.id ?? "");
};

const extractNameFromRef = (ref: PopulatedRef | undefined): string | undefined => {
  if (!ref || typeof ref === "string") return undefined;
  return ref.name;
};

const normalizeSection = (item: SectionApiResponse): SectionResponse => {
  const normalizedId = item.id ?? item._id;

  if (!normalizedId) {
    throw new Error("Section id is missing in API response");
  }

  return {
    id: String(normalizedId),
    name: item.name ?? "",
    classId: extractIdFromRef(item.classId),
    className: extractNameFromRef(item.classId),
    classTeacher: extractIdFromRef(item.classTeacher),
    classTeacherName: extractNameFromRef(item.classTeacher),
    createdAt: item.createdAt,
  };
};

const extractSectionsArray = (response: SectionsListResponse): SectionApiResponse[] => {
  if (Array.isArray(response)) {
    return response;
  }
  if (response.data && Array.isArray(response.data)) {
    return response.data;
  }
  return [];
};

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
export const updateClass = async (classId: string, classData: Partial<ClassData>): Promise<ClassResponse> => {
  const response = await apiClient.patch<ClassApiResponse>(API_ENDPOINTS.classes.byId(classId), classData);
  return normalizeClass(response);
};

// Delete class
export const deleteClass = async (classId: string): Promise<void> => {
  await apiClient.delete<void>(API_ENDPOINTS.classes.byId(classId));
};

// Add a new section
export const addSection = async (sectionData: SectionData): Promise<SectionResponse> => {
  const response = await apiClient.post<SectionApiResponse>(API_ENDPOINTS.sections.base, sectionData);
  return normalizeSection(response);
};

// Get all sections
export const getSections = async (): Promise<SectionResponse[]> => {
  const response = await apiClient.get<SectionsListResponse>(API_ENDPOINTS.sections.base);
  const sectionsArray = extractSectionsArray(response);
  return sectionsArray
    .map((item) => {
      try {
        return normalizeSection(item);
      } catch {
        return null;
      }
    })
    .filter((item): item is SectionResponse => item !== null);
};

// Get sections by class ID
export const getSectionsByClassId = async (classId: string): Promise<SectionResponse[]> => {
  const response = await apiClient.get<SectionsListResponse>(API_ENDPOINTS.sections.byClassId(classId));
  const sectionsArray = extractSectionsArray(response);
  return sectionsArray
    .map((item) => {
      try {
        return normalizeSection(item);
      } catch {
        return null;
      }
    })
    .filter((item): item is SectionResponse => item !== null);
};

// Update section
export const updateSection = async (sectionId: string, sectionData: Partial<SectionData>): Promise<SectionResponse> => {
  const response = await apiClient.patch<SectionApiResponse>(API_ENDPOINTS.sections.byId(sectionId), sectionData);
  return normalizeSection(response);
};

// Delete section
export const deleteSection = async (sectionId: string): Promise<void> => {
  await apiClient.delete<void>(API_ENDPOINTS.sections.byId(sectionId));
};
