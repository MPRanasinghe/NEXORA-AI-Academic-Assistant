"use client";

import StudentRouteGuard from "@/components/layout/StudentRouteGuard";

export default function StudentQuizzesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StudentRouteGuard>{children}</StudentRouteGuard>;
}
