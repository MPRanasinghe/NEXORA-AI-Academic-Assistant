"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDemoAuth } from "@/lib/demo-auth-context";

export default function AdministrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, loading } = useDemoAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && role !== "administrator") {
      router.replace("/dashboard");
    }
  }, [loading, role, router]);

  if (loading || role !== "administrator") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
          <p className="text-xs text-slate-400">Verifying administrator authorization...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
