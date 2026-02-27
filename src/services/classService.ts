// Class API Service - Handles all class-related API calls
const API_BASE_URL = "https://sms-backend-d19v.onrender.com/api";

interface ClassData {
  name: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface ClassResponse {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = sessionStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Add a new class
export const addClass = async (classData: ClassData): Promise<ClassResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/classes`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(classData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to add class");
    }

    const result: ApiResponse<ClassResponse> = await response.json();
    return result.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("An unexpected error occurred");
  }
};

// Get all classes
export const getClasses = async (): Promise<ClassResponse[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/classes`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch classes");
    }

    const result: ApiResponse<ClassResponse[]> = await response.json();
    return result.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("An unexpected error occurred");
  }
};

// Get class by ID
export const getClassById = async (classId: string): Promise<ClassResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/classes/${classId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch class");
    }

    const result: ApiResponse<ClassResponse> = await response.json();
    return result.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("An unexpected error occurred");
  }
};

// Update class
export const updateClass = async (classId: string, classData: ClassData): Promise<ClassResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/classes/${classId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(classData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update class");
    }

    const result: ApiResponse<ClassResponse> = await response.json();
    return result.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("An unexpected error occurred");
  }
};

// Delete class
export const deleteClass = async (classId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/classes/${classId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete class");
    }
  } catch (error) {
    throw error instanceof Error ? error : new Error("An unexpected error occurred");
  }
};
