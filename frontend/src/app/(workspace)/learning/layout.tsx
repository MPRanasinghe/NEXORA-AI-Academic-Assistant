"use client";

import StudentRouteGuard from "@/components/layout/StudentRouteGuard";

export default function StudentLearningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StudentRouteGuard>{children}</StudentRouteGuard>;
}
