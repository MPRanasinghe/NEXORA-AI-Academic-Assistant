"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import CourseDetails from "@/components/academic-staff/CourseDetails";
import { StaffCourse, StaffCourseResource } from "@/lib/academic-staff-types";
import {
  getCourseById,
  getResourcesByCourse,
} from "@/lib/academic-staff-service";

export default function AssignedCourseDetailPage() {
  const params = useParams<{ courseId: string }>();
  const courseId = params?.courseId as string;

  const [course, setCourse] = useState<StaffCourse | null>(null);
  const [resources, setResources] = useState<StaffCourseResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!courseId) return;
      try {
        const [c, r] = await Promise.all([
          getCourseById(courseId),
          getResourcesByCourse(courseId),
        ]);
        setCourse(c);
        setResources(r);
      } catch (err) {
        console.error("Failed to load course details:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
        <p className="text-xs text-slate-400">Loading course syllabus and materials...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-300">
          <BookOpen size={26} />
        </div>
        <h2 className="mt-5 text-xl font-bold text-white">Course Not Found</h2>
        <p className="mt-2 text-xs leading-relaxed text-slate-400">
          The requested course identifier (<code className="font-mono text-cyan-300">{courseId}</code>)
          was not found in your assigned teaching roster.
        </p>
        <Link
          href="/academic-services/courses"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:brightness-110"
        >
          <ArrowLeft size={15} />
          <span>Return to Assigned Courses</span>
        </Link>
      </div>
    );
  }

  return <CourseDetails course={course} resources={resources} />;
}
