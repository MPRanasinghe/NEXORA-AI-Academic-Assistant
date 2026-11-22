
export type UserRole = "student" | "academic_staff" | "administrator";

// ---------------------------------------------------------------------------
// Role metadata helpers
// ---------------------------------------------------------------------------

export interface RoleMeta {
  label: string;
  description: string;
  color: string;
  defaultPath: string;
}

export const ROLE_META: Record<UserRole, RoleMeta> = {
  student: {
    label: "Student",
    description: "Access quizzes, learning resources, and the AI assistant.",
    color: "violet",
    defaultPath: "/dashboard",
  },
  academic_staff: {
    label: "Academic Staff",
    description: "Manage quizzes, courses, and monitor student progress.",
    color: "cyan",
    defaultPath: "/dashboard",
  },
  administrator: {
    label: "Administrator",
    description: "Full platform access — users, analytics, and system settings.",
    color: "blue",
    defaultPath: "/dashboard",
  },
};
