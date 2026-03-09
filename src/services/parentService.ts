import { apiClient } from "@/api/client";

export interface Parent {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  children: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    admissionNumber: string;
    classId: {
      _id: string;
      name: string;
    };
    sectionId: {
      _id: string;
      name: string;
    };
    rollNumber: string;
    status: string;
  }>;
  occupation?: string;
  address?: string;
  relationToStudent: string;
  emergencyContact?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ParentDashboard {
  totalChildren: number;
  children: Array<{
    _id: string;
    name: string;
    admissionNumber: string;
    className: string;
    sectionName: string;
    attendanceStats: {
      totalDays: number;
      presentDays: number;
      absentDays: number;
      lateDays: number;
      attendancePercentage: number;
    };
    feeStats: {
      totalFees: number;
      paidFees: number;
      pendingFees: number;
      lastPaymentDate?: string;
    };
    academicStats: {
      totalSubjects: number;
      averageMarks: number;
      lastExamResults?: Array<{
        subjectName: string;
        marks: number;
        totalMarks: number;
        grade: string;
      }>;
    };
  }>;
  upcomingEvents: Array<{
    title: string;
    date: string;
    type: "exam" | "holiday" | "meeting" | "event";
  }>;
  recentAnnouncements: Array<{
    title: string;
    message: string;
    date: string;
    priority: "low" | "medium" | "high";
  }>;
}

export interface ChildDetail {
  _id: string;
  firstName: string;
  lastName: string;
  admissionNumber: string;
  classId: {
    _id: string;
    name: string;
  };
  sectionId: {
    _id: string;
    name: string;
  };
  rollNumber: string;
  dateOfBirth: string;
  gender: string;
  address?: string;
  status: string;
  attendanceHistory: Array<{
    date: string;
    status: "present" | "absent" | "late" | "leave";
    markedBy?: string;
  }>;
  feeRecords: Array<{
    feeType: string;
    amount: number;
    dueDate: string;
    paidDate?: string;
    status: "paid" | "pending" | "overdue";
    paymentMethod?: string;
  }>;
  examResults: Array<{
    examName: string;
    date: string;
    subjects: Array<{
      subjectName: string;
      marks: number;
      totalMarks: number;
      grade: string;
      percentage: number;
    }>;
    totalPercentage: number;
    rank?: number;
  }>;
  behaviorRecords: Array<{
    date: string;
    type: "positive" | "negative" | "neutral";
    description: string;
    points: number;
    recordedBy: string;
  }>;
}

export interface ParentProfile {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  occupation?: string;
  address?: string;
  relationToStudent: string;
  emergencyContact?: string;
  children: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    admissionNumber: string;
    className: string;
    sectionName: string;
  }>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const parentService = {
  // Get parent dashboard data
  getDashboard: async (): Promise<ParentDashboard> => {
    const response = await apiClient.get<ParentDashboard>("parent/dashboard");
    return response;
  },

  // Get parent profile
  getProfile: async (): Promise<ParentProfile> => {
    const response = await apiClient.get<ParentProfile>("parent/profile");
    return response;
  },

  // Update parent profile
  updateProfile: async (data: {
    occupation?: string;
    address?: string;
    emergencyContact?: string;
  }): Promise<ParentProfile> => {
    const response = await apiClient.put<ParentProfile>("parent/profile", data);
    return response;
  },

  // Get parent's children
  getChildren: async (): Promise<Parent["children"]> => {
    const response = await apiClient.get<Parent["children"]>("parent/children");
    return response;
  },

  // Get detailed information about a specific child
  getChildDetail: async (childId: string): Promise<ChildDetail> => {
    const response = await apiClient.get<ChildDetail>(`parent/children/${childId}`);
    return response;
  },

  // Get child's attendance
  getChildAttendance: async (childId: string, filters?: {
    startDate?: string;
    endDate?: string;
  }): Promise<ChildDetail["attendanceHistory"]> => {
    const queryParams = new URLSearchParams(
      Object.fromEntries(Object.entries(filters || {}).filter(([_, v]) => v !== undefined))
    );
    const response = await apiClient.get<ChildDetail["attendanceHistory"]>(
      `parent/children/${childId}/attendance?${queryParams}`
    );
    return response;
  },

  // Get child's fee records
  getChildFees: async (childId: string): Promise<ChildDetail["feeRecords"]> => {
    const response = await apiClient.get<ChildDetail["feeRecords"]>(
      `parent/children/${childId}/fees`
    );
    return response;
  },

  // Get child's exam results
  getChildResults: async (childId: string): Promise<ChildDetail["examResults"]> => {
    const response = await apiClient.get<ChildDetail["examResults"]>(
      `parent/children/${childId}/results`
    );
    return response;
  },

  // Get child's behavior records
  getChildBehavior: async (childId: string): Promise<ChildDetail["behaviorRecords"]> => {
    const response = await apiClient.get<ChildDetail["behaviorRecords"]>(
      `parent/children/${childId}/behavior`
    );
    return response;
  },

  // Get child's homework
  getChildHomework: async (childId: string): Promise<Array<{
    _id: string;
    title: string;
    description: string;
    subject: string;
    assignedDate: string;
    dueDate: string;
    status: "pending" | "submitted" | "overdue";
    submittedDate?: string;
    marks?: number;
  }>> => {
    const response = await apiClient.get<Array<{
      _id: string;
      title: string;
      description: string;
      subject: string;
      assignedDate: string;
      dueDate: string;
      status: "pending" | "submitted" | "overdue";
      submittedDate?: string;
      marks?: number;
    }>>(`parent/children/${childId}/homework`);
    return response;
  },

  // Get child's announcements
  getChildAnnouncements: async (childId: string): Promise<Array<{
    _id: string;
    title: string;
    message: string;
    date: string;
    priority: "low" | "medium" | "high";
    type: "general" | "academic" | "fees" | "event";
  }>> => {
    const response = await apiClient.get<Array<{
      _id: string;
      title: string;
      message: string;
      date: string;
      priority: "low" | "medium" | "high";
      type: "general" | "academic" | "fees" | "event";
    }>>(`parent/children/${childId}/announcements`);
    return response;
  },

  // Submit leave request for child
  submitLeaveRequest: async (childId: string, data: {
    reason: string;
    startDate: string;
    endDate: string;
    attachment?: string;
  }): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post<{ success: boolean; message: string }>(
      `parent/children/${childId}/leave-request`,
      data
    );
    return response;
  },

  // Get leave requests
  getLeaveRequests: async (childId: string): Promise<Array<{
    _id: string;
    reason: string;
    startDate: string;
    endDate: string;
    status: "pending" | "approved" | "rejected";
    submittedDate: string;
    approvedBy?: string;
    approvedDate?: string;
    rejectionReason?: string;
  }>> => {
    const response = await apiClient.get<Array<{
      _id: string;
      reason: string;
      startDate: string;
      endDate: string;
      status: "pending" | "approved" | "rejected";
      submittedDate: string;
      approvedBy?: string;
      approvedDate?: string;
      rejectionReason?: string;
    }>>(`parent/children/${childId}/leave-requests`);
    return response;
  },

  // Make online payment
  makePayment: async (data: {
    childId: string;
    feeType: string;
    amount: number;
    paymentMethod: "online" | "cash" | "cheque";
    transactionId?: string;
  }): Promise<{ success: boolean; message: string; paymentId?: string }> => {
    const response = await apiClient.post<{ success: boolean; message: string; paymentId?: string }>(
      "parent/payment",
      data
    );
    return response;
  },

  // Get payment history
  getPaymentHistory: async (): Promise<Array<{
    _id: string;
    childName: string;
    feeType: string;
    amount: number;
    paymentDate: string;
    paymentMethod: string;
    status: "success" | "failed" | "pending";
    transactionId?: string;
  }>> => {
    const response = await apiClient.get<Array<{
      _id: string;
      childName: string;
      feeType: string;
      amount: number;
      paymentDate: string;
      paymentMethod: string;
      status: "success" | "failed" | "pending";
      transactionId?: string;
    }>>("parent/payment-history");
    return response;
  }
};
