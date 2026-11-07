
export type UserRole = "student" | "academic_staff" | "administrator";

// ---------------------------------------------------------------------------
// Storage key – single source of truth used by every module
// ---------------------------------------------------------------------------
export const DEMO_ROLE_KEY = "nexora_demo_role";
export const DEMO_SESSION_KEY = "nexora_demo_session";

// ---------------------------------------------------------------------------
// Static fallback used in server components / legacy imports
// (kept so existing `import { DEMO_ROLE }` lines still compile)
// ---------------------------------------------------------------------------
export const DEMO_ROLE: UserRole = "student";

// ---------------------------------------------------------------------------
// Runtime helpers – safe to call only in the browser
// ---------------------------------------------------------------------------

/** Read the active demo role from localStorage (browser only). */
export function getDemoRole(): UserRole | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(DEMO_ROLE_KEY);
  if (
    stored === "student" ||
    stored === "academic_staff" ||
    stored === "administrator"
  ) {
    return stored as UserRole;
  }
  return null;
}

/** Persist the selected role and mark the session as active. */
export function setDemoRole(role: UserRole): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(DEMO_ROLE_KEY, role);
  localStorage.setItem(DEMO_SESSION_KEY, "true");
}

/** Wipe the demo session so the user is redirected to /login. */
export function clearDemoSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(DEMO_ROLE_KEY);
  localStorage.removeItem(DEMO_SESSION_KEY);
}

/** Returns true when a demo session is currently active. */
export function isDemoSessionActive(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(DEMO_SESSION_KEY) === "true";
}

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
