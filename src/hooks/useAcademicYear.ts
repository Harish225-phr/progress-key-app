import { useState, useCallback, useEffect } from "react";
import {
  academicYearService,
  type AcademicYear,
} from "@/services/academicYearService";

export interface UseAcademicYearReturn {
  list: AcademicYear[];
  current: AcademicYear | null;
  loading: boolean;
  error: string | null;
  refetchList: () => Promise<void>;
  refetchCurrent: () => Promise<void>;
  setCurrentYear: (id: string) => Promise<boolean>;
}

export function useAcademicYear(options?: { fetchListOnMount?: boolean; fetchCurrentOnMount?: boolean }): UseAcademicYearReturn {
  const { fetchListOnMount = true, fetchCurrentOnMount = true } = options ?? {};
  const [list, setList] = useState<AcademicYear[]>([]);
  const [current, setCurrent] = useState<AcademicYear | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetchList = useCallback(async () => {
    try {
      setError(null);
      const data = await academicYearService.getList();
      setList(data ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load academic years");
      setList([]);
    }
  }, []);

  const refetchCurrent = useCallback(async () => {
    try {
      setError(null);
      const data = await academicYearService.getCurrent();
      setCurrent(data);
    } catch {
      setCurrent(null);
    }
  }, []);

  const setCurrentYear = useCallback(async (id: string): Promise<boolean> => {
    try {
      await academicYearService.setCurrent(id);
      await refetchCurrent();
      await refetchList();
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to set current year");
      return false;
    }
  }, [refetchCurrent, refetchList]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        if (fetchListOnMount) await refetchList();
        if (fetchCurrentOnMount) await refetchCurrent();
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [fetchListOnMount, fetchCurrentOnMount]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    list,
    current,
    loading,
    error,
    refetchList,
    refetchCurrent,
    setCurrentYear,
  };
}
