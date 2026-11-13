"use client";

import AcademicStaffRouteGuard from "@/components/layout/AcademicStaffRouteGuard";

export default function QuizManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AcademicStaffRouteGuard>{children}</AcademicStaffRouteGuard>;
}
