import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

export interface FeeStructurePayload {
  classId: string;
  tuitionFee: number;
  transportFee?: number;
  examFee?: number;
  otherCharges?: number;
  /** Optional; backend uses current academic year if omitted */
  academicYear?: string;
}

export interface AssignFeePayload {
  classId: string;
  /** Optional; backend uses current academic year if omitted */
  academicYear?: string;
}

export interface RecordPaymentPayload {
  amount: number;
  paymentMode: "Cash" | "UPI" | "Bank";
  /** Optional; for students with fees in multiple years */
  academicYear?: string;
}

export interface StudentFeeDetail {
  studentId: string;
  classId?: string;
  academicYear?: string;
  totalAmount?: number;
  paidAmount?: number;
  pendingAmount?: number;
  payments?: { amount: number; paymentMode?: string; paidAt?: string }[];
  [key: string]: unknown;
}

export const feeService = {
  /** Create fee structure for a class. Omit academicYear to use current year. */
  createStructure: async (payload: FeeStructurePayload): Promise<unknown> => {
    return apiClient.post(API_ENDPOINTS.fees.structure, payload);
  },

  /** Assign fee to student. Omit academicYear to use current year. */
  assign: async (studentId: string, payload: AssignFeePayload): Promise<unknown> => {
    return apiClient.post(API_ENDPOINTS.fees.assign(studentId), payload);
  },

  /** Record payment. Send academicYear when student has fees for multiple years. */
  recordPayment: async (
    studentId: string,
    payload: RecordPaymentPayload
  ): Promise<unknown> => {
    return apiClient.post(API_ENDPOINTS.fees.payment(studentId), payload);
  },

  /** Get student fee details. Use ?academicYear=2024-2025 for a specific year. */
  getStudentDetails: async (
    studentId: string,
    params?: { academicYear?: string }
  ): Promise<StudentFeeDetail> => {
    const query = params?.academicYear
      ? `?academicYear=${encodeURIComponent(params.academicYear)}`
      : "";
    return apiClient.get<StudentFeeDetail>(
      `${API_ENDPOINTS.fees.student(studentId)}${query}`
    );
  },
};
