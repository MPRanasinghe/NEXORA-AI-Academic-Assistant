import type { UserRole } from "@/lib/user-role";

export interface AuthUser {
  id: number;
  full_name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface AuthTokenResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

export interface AcademicChatResponse {
  answer: string;
  sources: {
    title: string;
    category: string;
    relevance: number;
  }[];
  context_used: boolean;
}

export interface UploadedAcademicDocument {
  message: string;
  document_id: number;
  filename: string;
  stored_filename: string;
  status: string;
  extraction: {
    page_count: number;
    character_count: number;
  };
  ingestion: {
    chunk_count: number;
    total_indexed_chunks: number;
    status: string;
  };
}

export interface AcademicDocumentListItem {
  id: number;
  filename: string;
  uploaded_at: string;
  status: string;
}

export interface AdminDashboardSummary {
  total_registered_users: number;
  total_students: number;
  total_academic_staff: number;
  total_administrators: number;
  total_uploaded_documents: number;
  total_quizzes: number;
}

export interface AdminUser {
  id: number;
  full_name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export class AuthApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:8000";
const TOKEN_KEY = "nexora_auth_token";

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  let response: Response;
  try {
    const isFormData =
      typeof FormData !== "undefined" && options.body instanceof FormData;
    response = await fetch(`${API_BASE_URL}/api/v1${path}`, {
      ...options,
      headers: isFormData
        ? options.headers
        : {
            "Content-Type": "application/json",
            ...options.headers,
          },
    });
  } catch {
    throw new AuthApiError(
      "Unable to reach the server. Please try again.",
      0,
    );
  }

  const text = await response.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const detail =
      typeof data === "object" && data !== null && "detail" in data
        ? (data as { detail: unknown }).detail
        : null;
    const message =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail)
          ? "Please check the submitted information."
          : "Authentication request failed.";
    throw new AuthApiError(message, response.status);
  }

  return data as T;
}

export function registerUser(input: {
  full_name: string;
  email: string;
  password: string;
  role?: "student" | "academic_staff";
}) {
  return request<AuthUser>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ ...input, role: input.role ?? "student" }),
  });
}

export function loginUser(email: string, password: string) {
  return request<AuthTokenResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function getCurrentUser(token: string) {
  return request<AuthUser>("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function getAdminDashboardSummary() {
  const token = window.localStorage.getItem(TOKEN_KEY);
  if (!token) {
    throw new AuthApiError("Please sign in to view the dashboard.", 401);
  }

  return request<AdminDashboardSummary>("/admin/dashboard/summary", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function getAdminUsers() {
  const token = window.localStorage.getItem(TOKEN_KEY);
  if (!token) {
    throw new AuthApiError("Please sign in to view users.", 401);
  }

  return request<AdminUser[]>("/admin/users", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function askAcademicAssistant(question: string) {
  const token = window.localStorage.getItem(TOKEN_KEY);
  if (!token) {
    throw new AuthApiError("Please sign in to use the academic assistant.", 401);
  }

  return request<AcademicChatResponse>("/chat/ask", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ question }),
  });
}

export function uploadAcademicDocument(file: File) {
  const token = window.localStorage.getItem(TOKEN_KEY);
  if (!token) {
    throw new AuthApiError(
      "Please sign in with an authorized staff account to upload documents.",
      401,
    );
  }

  const body = new FormData();
  body.append("file", file);

  return request<UploadedAcademicDocument>("/documents/upload", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body,
  });
}

export function getAcademicDocuments() {
  const token = window.localStorage.getItem(TOKEN_KEY);
  if (!token) {
    throw new AuthApiError(
      "Please sign in with an authorized staff account to view documents.",
      401,
    );
  }

  return request<AcademicDocumentListItem[]>("/documents/", {
    headers: { Authorization: `Bearer ${token}` },
  });
}
