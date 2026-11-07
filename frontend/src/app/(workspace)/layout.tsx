
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import WorkspaceSidebar from "@/components/layout/WorkspaceSidebar";
import WorkspaceHeader from "@/components/layout/WorkspaceHeader";
import { useDemoAuth } from "@/lib/demo-auth-context";

export default function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { role, loading } = useDemoAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && role === null) {
      router.replace("/login");
    }
  }, [loading, role, router]);

  // Show a minimal full-screen loader while restoring the session
  if (loading || role === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080B18]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <span className="text-xl font-black text-white">N</span>
          </div>
          <div className="h-1 w-32 overflow-hidden rounded-full bg-white/[0.06]">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-violet-500/60" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#080B18] text-slate-100">
      {/* Sidebar */}
      <WorkspaceSidebar role={role} />

      {/* Main Workspace */}
      <div className="flex min-w-0 flex-1 flex-col">
        <WorkspaceHeader role={role} />

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
