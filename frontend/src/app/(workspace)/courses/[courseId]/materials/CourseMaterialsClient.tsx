"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  ExternalLink,
  FileText,
  Filter,
  Search,
} from "lucide-react";
import StudentRouteGuard from "@/components/layout/StudentRouteGuard";
import { useStudentAcademicRecord } from "@/lib/academic-storage";
import { getStaffResources } from "@/lib/academic-staff-service";
import type { StaffCourseResource } from "@/lib/academic-staff-types";
import {
  COURSE_MATERIALS,
  getStaffCourseMaterials,
  type CourseMaterial,
  type CourseMaterialType,
} from "@/lib/course-materials";
import { useStudentEnrollments } from "@/lib/student-enrollments";

const resourceTypes: Array<CourseMaterialType | "All types"> = [
  "All types",
  "Lecture slides",
  "Lecture notes",
  "Reading material",
  "PDF document",
  "Supporting resource",
  "Lab sheet",
  "Syllabus & Guide",
];

function getSafeExternalUrl(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

function formatDate(value: string): string {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "Date not available";
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function CourseMaterialsPage() {
  const params = useParams<{ courseId: string }>();
  const { record } = useStudentAcademicRecord();
  const enrollments = useStudentEnrollments(record.studentId);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] =
    useState<CourseMaterialType | "All types">("All types");
  const [staffResources, setStaffResources] = useState<StaffCourseResource[]>([]);
  const [resourcesError, setResourcesError] = useState("");
  const [previewMaterial, setPreviewMaterial] = useState<CourseMaterial | null>(
    null,
  );

  useEffect(() => {
    let active = true;
    getStaffResources()
      .then((resources) => {
        if (active) setStaffResources(resources);
      })
      .catch((error: unknown) => {
        console.error("Failed to load Academic Staff course materials:", error);
        if (active) {
          setResourcesError(
            "Academic Staff resources could not be loaded. Please try again later.",
          );
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const courseEntry = record.terms
    .flatMap((term) => term.courses.map((course) => ({ course, term })))
    .find(
      ({ course, term }) =>
        course.id === params.courseId &&
        enrollments.some(
          (enrollment) =>
            enrollment.courseId === course.id && enrollment.termId === term.id,
        ),
    );

  const courseMaterials = useMemo(() => {
    if (!courseEntry) return [];
    const staffMaterials = getStaffCourseMaterials(
      courseEntry.course.id,
      courseEntry.course.courseCode,
      staffResources,
    );
    return [...COURSE_MATERIALS, ...staffMaterials].filter(
      (material) => material.courseId === params.courseId,
    );
  }, [courseEntry, params.courseId, staffResources]);

  const materials = useMemo(
    () =>
      courseMaterials
        .filter(
          (material) =>
            selectedType === "All types" ||
            material.resourceType === selectedType,
        )
        .filter((material) => {
          const query = search.trim().toLowerCase();
          return (
            !query ||
            material.title.toLowerCase().includes(query) ||
            material.description.toLowerCase().includes(query) ||
            material.resourceType.toLowerCase().includes(query) ||
            material.fileName?.toLowerCase().includes(query)
          );
        }),
    [courseMaterials, search, selectedType],
  );

  return (
    <StudentRouteGuard>
      {!courseEntry ? (
        <div className="mx-auto flex min-h-[65vh] max-w-2xl flex-col items-center justify-center px-5 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/15 bg-violet-500/10 text-violet-300">
            <BookOpen size={25} />
          </div>
          <h2 className="mt-5 text-2xl font-semibold text-white">
            Course not found
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Materials are available only for courses in your enrollment
            records.
          </p>
          <Link
            href="/courses"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
          >
            <ArrowLeft size={16} />
            Return to My Courses
          </Link>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-6xl space-y-7 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
          <Link
            href={`/courses/${courseEntry.course.id}`}
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Course Details
          </Link>

          <section className="relative overflow-hidden rounded-3xl border border-cyan-500/15 bg-gradient-to-br from-cyan-500/[0.08] via-[#11162A] to-violet-500/[0.06] p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-cyan-500/[0.08] blur-3xl" />
            <div className="relative">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 font-semibold text-cyan-300">
                  {courseEntry.course.courseCode}
                </span>
                <span className="text-slate-400">{courseEntry.term.label}</span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
                Course Materials
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                {courseEntry.course.courseTitle}
              </p>
              <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-400">
                Resources are matched to this course by course code. Demo files
                are not downloadable unless an external link is provided.
              </p>
            </div>
          </section>

          {resourcesError && (
            <section
              role="alert"
              className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.05] px-4 py-3 text-xs leading-5 text-amber-100/80"
            >
              {resourcesError}
            </section>
          )}

          <section className="flex flex-col gap-3 sm:flex-row">
            <label className="relative min-w-0 flex-1">
              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search course materials..."
                aria-label="Search course materials"
                className="w-full rounded-xl border border-white/[0.08] bg-[#11162A] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/40"
              />
            </label>
            <label className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#11162A] px-3">
              <Filter size={16} className="shrink-0 text-slate-400" />
              <select
                value={selectedType}
                onChange={(event) =>
                  setSelectedType(
                    resourceTypes.find((type) => type === event.target.value) ??
                      "All types",
                  )
                }
                aria-label="Filter materials by resource type"
                className="min-w-0 bg-transparent py-3 text-sm text-slate-300 outline-none"
              >
                {resourceTypes.map((type) => (
                  <option key={type} value={type} className="bg-[#11162A]">
                    {type}
                  </option>
                ))}
              </select>
            </label>
          </section>

          <p className="text-xs text-slate-500">
            Showing {materials.length}{" "}
            {materials.length === 1 ? "resource" : "resources"}
          </p>

          {materials.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {materials.map((material) => {
                const externalUrl = getSafeExternalUrl(
                  material.externalResourceUrl,
                );
                const hasInvalidUrl =
                  Boolean(material.externalResourceUrl) && !externalUrl;

                return (
                  <article
                    key={material.id}
                    className="flex flex-col rounded-2xl border border-white/[0.08] bg-[#11162A] p-5 transition hover:border-violet-500/20 hover:bg-[#141A30]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-500/15 bg-violet-500/[0.08] text-violet-300">
                        <FileText size={20} />
                      </div>
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[10px] font-medium ${
                          externalUrl
                            ? "border-cyan-400/15 bg-cyan-500/[0.07] text-cyan-300"
                            : "border-amber-400/15 bg-amber-500/[0.06] text-amber-200"
                        }`}
                      >
                        {externalUrl
                          ? "External resource"
                          : hasInvalidUrl
                            ? "Link unavailable"
                            : "Sample resource"}
                      </span>
                    </div>

                    {material.source && (
                      <p className="mt-3 text-[10px] font-medium uppercase tracking-wide text-cyan-300">
                        Shared by {material.source}
                      </p>
                    )}
                    <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-violet-300">
                      {material.resourceType}
                    </p>
                    <h3 className="mt-2 text-base font-semibold text-white">
                      {material.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-6 text-slate-400">
                      {material.description}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/[0.06] pt-4 text-xs">
                      <div>
                        <p className="text-slate-500">File</p>
                        <p className="mt-1 break-all text-slate-300">
                          {material.fileName ?? "Online resource"}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500">Displayed size</p>
                        <p className="mt-1 text-slate-300">
                          {material.fileSize}
                        </p>
                      </div>
                      <div className="col-span-2 flex items-center gap-1.5 text-slate-500">
                        <CalendarDays size={13} />
                        Added {formatDate(material.dateAdded)}
                      </div>
                    </div>

                    {externalUrl ? (
                      <a
                        href={externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/15"
                      >
                        Open external resource
                        <ExternalLink size={15} />
                      </a>
                    ) : (
                      <div className="mt-5">
                        {material.previewContent ? (
                          <button
                            type="button"
                            onClick={() => setPreviewMaterial(material)}
                            className="w-full rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/15"
                          >
                            Preview sample content
                          </button>
                        ) : (
                          <p className="rounded-xl border border-amber-500/15 bg-amber-500/[0.04] px-3 py-2.5 text-xs leading-5 text-amber-100/70">
                            {hasInvalidUrl
                              ? "This resource link is invalid and cannot be opened."
                              : "Sample metadata only. No document is uploaded; preview and download are unavailable."}
                          </p>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/[0.12] bg-[#11162A]/70 px-5 py-16 text-center">
              <Search size={28} className="mx-auto text-slate-500" />
              <h3 className="mt-4 font-semibold text-white">
                {courseMaterials.length > 0
                  ? "No materials match your filters"
                  : "No materials available yet"}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                {courseMaterials.length > 0
                  ? "Try another search term or resource type."
                  : "Sample materials have not been added for this course."}
              </p>
              {(search || selectedType !== "All types") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedType("All types");
                  }}
                  className="mt-4 text-sm font-medium text-violet-300 hover:text-violet-200"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      )}
      {previewMaterial?.previewContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="course-resource-preview-title"
            className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-[#11162A] p-5 sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-cyan-300">
                  Demo resource preview
                </p>
                <h2
                  id="course-resource-preview-title"
                  className="mt-2 text-xl font-semibold text-white"
                >
                  {previewMaterial.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setPreviewMaterial(null)}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/[0.05]"
              >
                Close
              </button>
            </div>
            <pre className="mt-5 whitespace-pre-wrap rounded-xl border border-white/[0.07] bg-[#080B18]/60 p-4 text-sm leading-6 text-slate-300">
              {previewMaterial.previewContent}
            </pre>
          </section>
        </div>
      )}
    </StudentRouteGuard>
  );
}
