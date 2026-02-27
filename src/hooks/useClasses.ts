import { useState, useCallback } from "react";
import * as classService from "@/services/classService";

interface ClassData {
  name: string;
}

interface ClassResponse {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UseClassesReturn {
  // States
  classes: ClassResponse[];
  loading: boolean;
  error: string | null;

  // Add class
  addClass: (classData: ClassData) => Promise<ClassResponse | null>;

  // Delete class
  deleteClass: (classId: string) => Promise<boolean>;

  // Update class
  updateClass: (classId: string, classData: ClassData) => Promise<ClassResponse | null>;

  // Fetch all classes
  fetchClasses: () => Promise<void>;

  // Clear error
  clearError: () => void;
}

export const useClasses = (): UseClassesReturn => {
  const [classes, setClasses] = useState<ClassResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Add class
  const handleAddClass = useCallback(
    async (classData: ClassData): Promise<ClassResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const newClass = await classService.addClass(classData);
        setClasses((prevClasses) => [...prevClasses, newClass]);
        return newClass;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to add class";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Delete class
  const handleDeleteClass = useCallback(
    async (classId: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        await classService.deleteClass(classId);
        setClasses((prevClasses) => prevClasses.filter((cls) => cls.id !== classId));
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to delete class";
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Update class
  const handleUpdateClass = useCallback(
    async (classId: string, classData: ClassData): Promise<ClassResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const updatedClass = await classService.updateClass(classId, classData);
        setClasses((prevClasses) =>
          prevClasses.map((cls) => (cls.id === classId ? updatedClass : cls))
        );
        return updatedClass;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to update class";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Fetch all classes
  const handleFetchClasses = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const data = await classService.getClasses();
      setClasses(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch classes";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    classes,
    loading,
    error,
    addClass: handleAddClass,
    deleteClass: handleDeleteClass,
    updateClass: handleUpdateClass,
    fetchClasses: handleFetchClasses,
    clearError,
  };
};
