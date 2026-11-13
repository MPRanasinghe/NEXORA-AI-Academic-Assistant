"use client";

import React from "react";
import AcademicStaffRouteGuard from "@/components/layout/AcademicStaffRouteGuard";

export default function AcademicServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AcademicStaffRouteGuard>
      <div className="mx-auto max-w-[1440px] p-5 sm:p-8">
        {children}
      </div>
    </AcademicStaffRouteGuard>
  );
}
