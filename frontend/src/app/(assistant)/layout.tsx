"use client";

import { AssistantWorkspace } from "@/components/assistant/AssistantWorkspace";
import { useAuth } from "@/lib/auth-context";
import { ROLE_META } from "@/lib/user-role";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AssistantLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, role: authenticatedRole, loading } = useAuth();
  const router = useRouter();
  const profileName = user?.full_name ?? "";
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

  if (loading || authenticatedRole === null || user === null) {
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
        role: `${ROLE_META[authenticatedRole].label} Account`,
        initials: initials || "NX",
      }}
      storageId={
        String(user.id)
      }
      settingsHref={
        authenticatedRole === "administrator"
          ? "/administration/settings"
          : authenticatedRole === "academic_staff"
            ? "/academic-services"
            : "/settings"
      }
    >
      {children}
    </AssistantWorkspace>
  );
}
