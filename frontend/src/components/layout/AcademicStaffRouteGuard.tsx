"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDemoAuth } from "@/lib/demo-auth-context";

export default function AcademicStaffRouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, loading } = useDemoAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && role !== null && role !== "academic_staff") {
      router.replace("/dashboard");
    }
  }, [loading, role, router]);

  if (loading || role !== "academic_staff") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
        <p className="text-xs text-slate-400">
          Verifying Academic Staff credentials...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
