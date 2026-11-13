
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  FileText,
  GraduationCap,
  Download,
  Eye,
  Grid2X2,
  List,
  SlidersHorizontal,
  Clock,
  X,
  ArrowUpDown,
  Bookmark,
  FolderOpen,
  ChevronRight,
  Layers,
} from "lucide-react";

type ResourceCategory =
  | "Lecture Notes"
  | "Tutorials"
  | "Research Papers"
  | "Reference Materials";

type Resource = {
  id: number;
  title: string;
  description: string;
  category: ResourceCategory;
  course: string;
  lecturer: string;
  type: "PDF" | "DOCX" | "PPTX";
  pages: number;
  updated: string;
  size: string;
  courseId?: string;
};

const categories: ResourceCategory[] = [
  "Lecture Notes",
  "Tutorials",
  "Research Papers",
  "Reference Materials",
];

const resources: Resource[] = [
  {
    id: 1,
    title: "Introduction to Artificial Intelligence",
    description:
      "Fundamental concepts of AI, intelligent agents, problem-solving techniques, and the foundations of artificial intelligence.",
    category: "Lecture Notes",
    course: "SE302",
    courseId: "crs-302",
    lecturer: "Dr. Academic Staff",
    type: "PDF",
    pages: 42,
    updated: "Nov 02, 2026",
    size: "2.4 MB",
  },
  {
    id: 2,
    title: "Database Management Systems",
    description:
      "An introduction to relational databases, database architecture, SQL, normalization, and transaction management.",
    category: "Lecture Notes",
    course: "CS109",
    courseId: "crs-109",
    lecturer: "Dr. Academic Staff",
    type: "PDF",
    pages: 56,
    updated: "Oct 28, 2026",
    size: "3.1 MB",
  },
  {
    id: 3,
    title: "Programming Fundamentals Tutorial",
    description:
      "Practical programming exercises covering variables, control structures, functions, arrays, and problem-solving.",
    category: "Tutorials",
    course: "CS101",
    courseId: "crs-101",
    lecturer: "Academic Department",
    type: "PDF",
    pages: 28,
    updated: "Oct 25, 2026",
    size: "1.2 MB",
  },
  {
    id: 4,
    title: "Machine Learning: A Survey",
    description:
      "A research overview of supervised learning, unsupervised learning, model evaluation, and emerging applications.",
    category: "Research Papers",
    course: "SE302",
    courseId: "crs-302",
    lecturer: "Research Collection",
    type: "PDF",
    pages: 34,
    updated: "Oct 20, 2026",
    size: "1.8 MB",
  },
  {
    id: 5,
    title: "Software Engineering Principles",
    description:
      "Core software engineering principles, development methodologies, requirements analysis, and software design.",
    category: "Lecture Notes",
    course: "SE202",
    courseId: "crs-202",
    lecturer: "Academic Department",
    type: "PDF",
    pages: 48,
    updated: "Oct 18, 2026",
    size: "2.7 MB",
  },
  {
    id: 6,
    title: "Research Methodology Handbook",
    description:
      "A practical guide to research questions, literature reviews, research design, data collection, and academic writing.",
    category: "Reference Materials",
    course: "General",
    lecturer: "University Library",
    type: "PDF",
    pages: 86,
    updated: "Oct 12, 2026",
    size: "4.5 MB",
  },
  {
    id: 7,
    title: "Computer Networks Tutorial",
    description:
      "Exercises covering network models, IP addressing, routing, protocols, and network troubleshooting.",
    category: "Tutorials",
    course: "SE207",
    courseId: "crs-207",
    lecturer: "Academic Department",
    type: "PDF",
    pages: 22,
    updated: "Oct 08, 2026",
    size: "980 KB",
  },
  {
    id: 8,
    title: "Academic Writing Guidelines",
    description:
      "Reference guidelines for citations, academic integrity, report formatting, and scholarly writing.",
    category: "Reference Materials",
    course: "General",
    lecturer: "University Library",
    type: "PDF",
    pages: 31,
    updated: "Oct 01, 2026",
    size: "1.5 MB",
  },
];

const categoryColors: Record<ResourceCategory, string> = {
  "Lecture Notes": "text-violet-300 bg-violet-500/10 border-violet-500/20",
  Tutorials: "text-cyan-300 bg-cyan-500/10 border-cyan-500/20",
  "Research Papers": "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
  "Reference Materials": "text-amber-300 bg-amber-500/10 border-amber-500/20",
};

export default function LearningPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("recent");
  const [selectedResource, setSelectedResource] =
    useState<Resource | null>(null);
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  const filteredResources = useMemo(() => {
    let result = resources.filter((resource) => {
      const matchesCategory =
        selectedCategory === "All" ||
        resource.category === selectedCategory;

      const query = search.toLowerCase();

      const matchesSearch =
        resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query) ||
        resource.course.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });

    if (sort === "alphabetical") {
      result = [...result].sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }

    return result;
  }, [search, selectedCategory, sort]);

  const toggleBookmark = (id: number) => {
    setBookmarks((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  return (
    <div className="min-h-full bg-[#080B18] px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs text-slate-500">
              <span>Workspace</span>
              <ChevronRight size={13} />
              <span className="text-violet-300">Learning</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
              Learning Resources
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
              Explore sample materials, lecture notes, tutorials, and research
              references. These demo records are not an official library.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#11162A] px-4 py-3">
            <Layers size={18} className="text-violet-400" />
            <div>
              <p className="text-lg font-semibold text-white">
                {resources.length}
              </p>
              <p className="text-[10px] text-slate-500">
                Demo resources
              </p>
            </div>
          </div>
        </div>

        {/* Demo notice */}
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/15 bg-amber-500/[0.04] px-4 py-3">
          <Clock size={16} className="mt-0.5 shrink-0 text-amber-400" />
          <p className="text-xs leading-5 text-amber-200/70">
            Demonstration knowledge library. Actual university resources
            will be loaded from the NEXORA backend.
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {categories.map((category) => {
            const count = resources.filter(
              (resource) => resource.category === category
            ).length;

            const active = selectedCategory === category;

            return (
              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(active ? "All" : category)
                }
                className={`rounded-2xl border p-4 text-left transition ${
                  active
                    ? "border-violet-500/30 bg-violet-500/[0.08]"
                    : "border-white/[0.07] bg-[#11162A] hover:border-white/[0.14] hover:bg-[#171D35]"
                }`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border ${categoryColors[category]}`}
                  >
                    {category === "Lecture Notes" && (
                      <BookOpen size={19} />
                    )}
                    {category === "Tutorials" && (
                      <GraduationCap size={19} />
                    )}
                    {category === "Research Papers" && (
                      <FileText size={19} />
                    )}
                    {category === "Reference Materials" && (
                      <FolderOpen size={19} />
                    )}
                  </div>

                  <ChevronRight size={15} className="text-slate-600" />
                </div>

                <p className="text-sm font-semibold text-white">
                  {category}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {count} resources
                </p>
              </button>
            );
          })}
        </div>

        {/* Resource Library */}
        <section className="space-y-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Resource Library
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Browse and discover academic materials
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-xl border border-white/[0.08] bg-[#11162A] px-3 py-2.5 lg:w-64 lg:flex-none">
                <Search size={16} className="text-slate-500" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search resources..."
                  className="w-full bg-transparent text-xs text-white outline-none placeholder:text-slate-500"
                />
                {search && (
                  <button onClick={() => setSearch("")}>
                    <X size={14} className="text-slate-500" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#11162A] px-3 py-2.5">
                <ArrowUpDown size={15} className="text-slate-500" />
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="bg-transparent text-xs text-slate-300 outline-none"
                >
                  <option value="recent">Recent</option>
                  <option value="alphabetical">A–Z</option>
                </select>
              </div>

              <div className="flex rounded-xl border border-white/[0.08] bg-[#11162A] p-1">
                <button
                  onClick={() => setView("grid")}
                  className={`rounded-lg p-2 transition ${
                    view === "grid"
                      ? "bg-violet-500/15 text-violet-300"
                      : "text-slate-500 hover:text-white"
                  }`}
                  title="Grid view"
                >
                  <Grid2X2 size={16} />
                </button>

                <button
                  onClick={() => setView("list")}
                  className={`rounded-lg p-2 transition ${
                    view === "list"
                      ? "bg-violet-500/15 text-violet-300"
                      : "text-slate-500 hover:text-white"
                  }`}
                  title="List view"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal size={15} className="mr-1 text-slate-500" />

            {["All", ...categories].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-lg border px-3 py-2 text-xs transition ${
                  selectedCategory === category
                    ? "border-violet-500/25 bg-violet-500/10 text-violet-300"
                    : "border-white/[0.07] text-slate-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <p className="text-xs text-slate-500">
            Showing {filteredResources.length} resources
          </p>

          {/* Grid */}
          {filteredResources.length > 0 ? (
            <div
              className={
                view === "grid"
                  ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
                  : "space-y-3"
              }
            >
              {filteredResources.map((resource) => (
                <article
                  key={resource.id}
                  className={`group flex flex-col rounded-2xl border border-white/[0.07] bg-[#11162A] transition hover:border-violet-500/20 hover:bg-[#141A30] ${
                    view === "list"
                      ? "flex-row items-center gap-4 p-4"
                      : "p-5"
                  }`}
                >
                  <div
                    className={`flex items-start justify-between ${
                      view === "list" ? "hidden" : ""
                    }`}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-500/15 bg-violet-500/[0.08]">
                      <FileText size={21} className="text-violet-300" />
                    </div>

                    <button
                      onClick={() => toggleBookmark(resource.id)}
                      className={`rounded-lg p-2 transition ${
                        bookmarks.includes(resource.id)
                          ? "text-violet-300"
                          : "text-slate-600 hover:text-violet-300"
                      }`}
                      title="Bookmark resource"
                    >
                      <Bookmark
                        size={17}
                        fill={
                          bookmarks.includes(resource.id)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>
                  </div>

                  {view === "list" && (
                    <FileText
                      size={22}
                      className="shrink-0 text-violet-300"
                    />
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="mb-3 mt-4 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-md border px-2 py-1 text-[10px] font-medium ${categoryColors[resource.category]}`}
                      >
                        {resource.category}
                      </span>

                      <span className="rounded-md border border-white/[0.07] px-2 py-1 text-[10px] text-slate-500">
                        {resource.course}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold leading-6 text-white transition group-hover:text-violet-200">
                      {resource.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">
                      {resource.description}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-3 text-[10px] text-slate-500">
                      <span>{resource.type}</span>
                      <span>{resource.pages} pages</span>
                      <span>{resource.size}</span>
                    </div>

                    <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-600">
                      <Clock size={12} />
                      Updated {resource.updated}
                    </div>
                  </div>

                  <div
                    className={`mt-5 flex items-center gap-2 border-t border-white/[0.06] pt-4 ${
                      view === "list"
                        ? "mt-0 shrink-0 border-0 pt-0"
                        : ""
                    }`}
                  >
                    <button
                      onClick={() => setSelectedResource(resource)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/[0.08] px-3 py-2.5 text-xs text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
                    >
                      <Eye size={15} />
                      Preview
                    </button>

                    <button
                      type="button"
                      disabled
                      title="Downloads are unavailable in demo mode."
                      className="flex cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2.5 text-xs text-slate-500"
                    >
                      <Download size={15} />
                      <span className="hidden sm:inline">Unavailable</span>
                    </button>
                  </div>
                  {resource.courseId && (
                    <Link
                      href={`/courses/${resource.courseId}/materials`}
                      className="mt-3 block text-center text-xs font-medium text-cyan-300 transition hover:text-cyan-200"
                    >
                      Open course materials
                    </Link>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.1] py-20 text-center">
              <Search size={28} className="text-slate-600" />
              <p className="mt-4 text-sm font-medium text-white">
                No resources found
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Try a different search term or category.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                }}
                className="mt-4 text-xs text-violet-300 hover:text-violet-200"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Resource Preview Modal */}
      {selectedResource && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setSelectedResource(null)}
        >
          <div
            className="w-full max-w-xl rounded-2xl border border-white/[0.1] bg-[#11162A] p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">
                <FileText size={22} className="text-violet-300" />
              </div>

              <button
                onClick={() => setSelectedResource(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-white/[0.05] hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <span
              className={`mt-5 inline-flex rounded-md border px-2 py-1 text-[10px] ${categoryColors[selectedResource.category]}`}
            >
              {selectedResource.category}
            </span>

            <h2 className="mt-3 text-xl font-semibold text-white">
              {selectedResource.title}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              {selectedResource.description}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                ["Course", selectedResource.course],
                ["Format", selectedResource.type],
                ["Pages", String(selectedResource.pages)],
                ["File size", selectedResource.size],
                ["Updated", selectedResource.updated],
                ["Provider", selectedResource.lecturer],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3"
                >
                  <p className="text-[10px] text-slate-500">{label}</p>
                  <p className="mt-1 text-xs font-medium text-slate-300">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-amber-500/15 bg-amber-500/[0.04] p-3 text-xs leading-5 text-amber-200/70">
              This demo entry displays descriptive metadata only. It is not an
              uploaded document and has no downloadable file.
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setSelectedResource(null)}
                className="flex-1 rounded-xl border border-white/[0.08] py-3 text-sm text-slate-300 hover:bg-white/[0.04]"
              >
                Close
              </button>

              <button
                type="button"
                disabled
                title="Downloads are unavailable in demo mode."
                className="flex flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-white/[0.04] py-3 text-sm font-medium text-slate-500"
              >
                <Download size={16} />
                Unavailable
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
