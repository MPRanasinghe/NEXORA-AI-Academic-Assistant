export type UserRole =
  | "student"
  | "academic_staff"
  | "administrator";

// Temporary role until backend authentication is connected
export const DEMO_ROLE: UserRole = "student";