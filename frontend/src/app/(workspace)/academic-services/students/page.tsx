"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import StudentProgressTable from "@/components/academic-staff/StudentProgressTable";
import { StaffStudent } from "@/lib/academic-staff-types";
import { getSyntheticStudents } from "@/lib/academic-staff-service";

export default function StudentProgressPage() {
  const [students, setStudents] = useState<StaffStudent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getSyntheticStudents();
        setStudents(data);
      } catch (err) {
        console.error("Failed to load student progress data:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/academic-services"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={15} />
          <span>Back to Academic Services</span>
        </Link>

        <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-300">
          Cohort Academic Progress
        </span>
      </div>

      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#121633] via-[#0E1328] to-[#0A0D1D] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-48 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative z-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-violet-300">
            <Users size={13} className="text-violet-400" />
            <span>Student Performance Auditing</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Student Academic Progress Roster
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
            Supervise cumulative grade point averages, attendance metrics, credit clearance,
            and academic standing classifications for enrolled cohorts across your assigned modules.
          </p>
        </div>
      </section>

      {/* Main Content */}
      {loading ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
          <p className="text-xs text-slate-400">Loading student cohort profiles...</p>
        </div>
      ) : (
        <StudentProgressTable students={students} />
      )}
    </div>
  );
}
