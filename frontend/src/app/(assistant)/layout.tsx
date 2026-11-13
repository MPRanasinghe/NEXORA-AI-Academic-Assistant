"use client";

import { AssistantWorkspace } from "@/components/assistant/AssistantWorkspace";
import { useDemoAuth } from "@/lib/demo-auth-context";
import { ROLE_META } from "@/lib/demo-user";
import { useStudentAcademicRecord } from "@/lib/academic-storage";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AssistantLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { role: authenticatedRole, loading } = useDemoAuth();
  const router = useRouter();
  const { record } = useStudentAcademicRecord();
  const activeRole = authenticatedRole ?? "student";
  const profileName =
    activeRole === "student"
      ? record.studentName
      : `${ROLE_META[activeRole].label} Demo Account`;
  const initials = profileName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  useEffect(() => {
    if (!loading && authenticatedRole === null) {
      router.replace("/login");
    }
  }, [authenticatedRole, loading, router]);

  if (loading || authenticatedRole === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080B18]">
        <div className="h-8 w-8 animate-pulse rounded-xl bg-violet-500/60" />
      </div>
    );
  }

  return (
    <AssistantWorkspace
      profile={{
        name: profileName,
        role: `${ROLE_META[activeRole].label} Account`,
        initials: initials || "NX",
      }}
      storageId={
        activeRole === "student" ? record.studentId : activeRole
      }
      settingsHref={
        activeRole === "administrator"
          ? "/administration/settings"
          : activeRole === "academic_staff"
            ? "/academic-services"
            : "/settings"
      }
    >
      {children}
    </AssistantWorkspace>
  );
}
