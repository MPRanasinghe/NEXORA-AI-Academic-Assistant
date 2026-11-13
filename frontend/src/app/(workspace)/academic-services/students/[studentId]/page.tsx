"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Users } from "lucide-react";
import StudentRecordSummary from "@/components/academic-staff/StudentRecordSummary";
import { StaffStudent } from "@/lib/academic-staff-types";
import { getStudentById } from "@/lib/academic-staff-service";

export default function StudentDetailSummaryPage() {
  const params = useParams<{ studentId: string }>();
  const studentId = params?.studentId as string;

  const [student, setStudent] = useState<StaffStudent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!studentId) return;
      try {
        const data = await getStudentById(studentId);
        setStudent(data);
      } catch (err) {
        console.error("Failed to load student record summary:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
        <p className="text-xs text-slate-400">Loading student academic record...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
          <Users size={26} />
        </div>
        <h2 className="mt-5 text-xl font-bold text-white">Student Profile Not Found</h2>
        <p className="mt-2 text-xs leading-relaxed text-slate-400">
          The requested student identifier (<code className="font-mono text-cyan-300">{studentId}</code>)
          was not found in your assigned cohort records.
        </p>
        <Link
          href="/academic-services/students"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:brightness-110"
        >
          <ArrowLeft size={15} />
          <span>Return to Student Roster</span>
        </Link>
      </div>
    );
  }

  return <StudentRecordSummary student={student} />;
}
