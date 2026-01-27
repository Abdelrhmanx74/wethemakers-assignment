import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Types
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  salary: number | null;
  status: "open" | "closed";
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  creator?: {
    id: string;
    fullName: string;
    email: string;
  };
  _count?: {
    applications: number;
  };
}

export interface Application {
  id: string;
  resumeUrl?: string | null;
  resumeName?: string | null;
  coverLetter: string;
  status: "submitted" | "reviewed" | "rejected";
  createdAt: string;
  updatedAt: string;
  jobId: string;
  userId: string;
  job?: {
    id: string;
    title: string;
    location: string;
    salary: number | null;
    status: "open" | "closed";
  };
  user?: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: "admin" | "jobseeker";
  createdAt: string;
  applications?: {
    id: string;
    status: "submitted" | "reviewed" | "rejected";
    createdAt: string;
    job: {
      id: string;
      title: string;
      location?: string;
    };
  }[];
  _count?: {
    applications: number;
  };
}

export interface UserStats {
  totalJobs: number;
  totalApplications: number;
  totalApplicants: number;
  openJobs: number;
}

// Job queries
export interface JobQueryParams {
  search?: string;
  location?: string;
  status?: "open" | "closed";
  page?: number;
  limit?: number;
}

export interface ApplicationQueryParams {
  jobId?: string;
  status?: "submitted" | "reviewed" | "rejected";
  page?: number;
  limit?: number;
}

export interface UserQueryParams {
  role?: "admin" | "jobseeker";
  page?: number;
  limit?: number;
}
