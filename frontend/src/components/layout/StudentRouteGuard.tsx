"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDemoAuth } from "@/lib/demo-auth-context";

export default function StudentRouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, loading } = useDemoAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && role !== null && role !== "student") {
      router.replace("/dashboard");
    }
  }, [loading, role, router]);

  if (loading || role !== "student") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-pulse rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400" />
      </div>
    );
  }

  return children;
}
