
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ChevronRight,
  Search,
  Menu,
  X,
  UserRound,
} from "lucide-react";
import type { UserRole } from "@/lib/demo-user";
import { ROLE_META } from "@/lib/demo-user";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/assistant": "AI Assistant",
  "/learning": "Learning",
  "/courses": "My Courses",
  "/quizzes": "Quizzes",
  "/quiz-management": "Quiz Management",
  "/notes": "Notes",
  "/academic": "Academic Progress",
  "/academic-services": "Academic Services",
  "/academic-services/courses": "Assigned Courses",
  "/academic-services/resources": "Course Resources",
  "/academic-services/policies": "Academic Policies",
  "/academic-services/students": "Student Progress",
  "/administration": "Explainable RAG Overview",
  "/administration/knowledge-base": "Knowledge Base Management",
  "/administration/corpus": "Corpus & Mathematical Explorer",
  "/administration/document-processing": "Document Processing Pipeline",
  "/administration/retrieval": "Retrieval Explorer & Ranking",
  "/administration/explainability": "Mathematical Explainability",
  "/administration/agent-monitor": "Agent Execution Monitor",
  "/administration/evaluation": "RAG Evaluation Center",
  "/administration/dataset": "Ground Truth Dataset",
  "/administration/analytics": "Research Analytics & Telemetry",
  "/administration/configuration": "Model & Retrieval Configuration",
  "/administration/settings": "System Settings",
  "/administration/users": "User & Access Management",
  "/settings": "Settings",
};

interface WorkspaceHeaderProps {
  role?: UserRole;
  onMenuClick?: () => void;
}

const roleLinks: Record<UserRole, Array<{ title: string; href: string }>> = {
  student: [
    { title: "Dashboard", href: "/dashboard" },
    { title: "AI Assistant", href: "/assistant" },
    { title: "Learning", href: "/learning" },
    { title: "My Courses", href: "/courses" },
    { title: "Quiz Center", href: "/quizzes" },
    { title: "Academic Progress", href: "/academic" },
    { title: "Notes", href: "/notes" },
    { title: "Settings", href: "/settings" },
  ],
  academic_staff: [
    { title: "Dashboard", href: "/dashboard" },
    { title: "AI Assistant", href: "/assistant" },
    { title: "Quiz Management", href: "/quiz-management" },
    { title: "Academic Services", href: "/academic-services" },
  ],
  administrator: [
    { title: "Overview", href: "/administration" },
    { title: "AI Research Assistant", href: "/assistant" },
    { title: "Knowledge Base", href: "/administration/knowledge-base" },
    { title: "Corpus Explorer", href: "/administration/corpus" },
    { title: "Document Processing", href: "/administration/document-processing" },
    { title: "Retrieval Explorer", href: "/administration/retrieval" },
    { title: "Explainability", href: "/administration/explainability" },
    { title: "Agent Monitor", href: "/administration/agent-monitor" },
    { title: "Evaluation Center", href: "/administration/evaluation" },
    { title: "Ground Truth Dataset", href: "/administration/dataset" },
    { title: "Analytics & Reports", href: "/administration/analytics" },
    { title: "Model Configuration", href: "/administration/configuration" },
    { title: "System Settings", href: "/administration/settings" },
    { title: "User & Access Management", href: "/administration/users" },
  ],
};

export default function WorkspaceHeader({
  role,
  onMenuClick,
}: WorkspaceHeaderProps) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const currentTitle =
    (pathname.startsWith("/academic-services/courses/")
      ? "Course Details"
      : pathname.startsWith("/academic-services/students/")
      ? "Student Record Summary"
      : pathname.startsWith("/courses/")
      ? pathname.endsWith("/materials")
        ? "Course Materials"
        : "Course Details"
      : pageTitles[pathname]) ??
    Object.entries(pageTitles).find(([path]) =>
      pathname.startsWith(`${path}/`)
    )?.[1] ??
    "Workspace";

  const roleMeta = role ? ROLE_META[role] : null;

  // Role pill colours
  const rolePillClass: Record<UserRole, string> = {
    student: "border-violet-400/20 bg-violet-500/10 text-violet-300",
    academic_staff: "border-cyan-400/20 bg-cyan-500/10 text-cyan-300",
    administrator: "border-blue-400/20 bg-blue-500/10 text-blue-300",
  };
  const settingsHref =
    role === "administrator" ? "/administration/settings" : "/settings";
  const searchResults = useMemo(
    () =>
      roleLinks[role ?? "student"].filter((item) =>
        item.title.toLowerCase().includes(searchQuery.trim().toLowerCase()),
      ),
    [role, searchQuery],
  );

  return (
    <header className="sticky top-0 z-30 flex min-h-[72px] items-center justify-between gap-3 border-b border-white/[0.08] bg-[#080B18]/90 px-3 backdrop-blur-2xl sm:min-h-[84px] sm:px-6 lg:px-8">
      {/* Branding and Page Title */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open workspace navigation"
          className="shrink-0 rounded-lg p-2 text-slate-300 transition hover:bg-white/[0.06] lg:hidden"
        >
          <Menu size={19} />
        </button>
        <Link
          href="/dashboard"
          className="shrink-0 text-sm font-bold tracking-[0.1em] text-white sm:text-base sm:tracking-[0.15em]"
        >
          NEXORA
        </Link>

        <ChevronRight size={16} className="hidden shrink-0 text-slate-600 sm:block" />

        <h1 className="truncate text-xs font-semibold text-violet-300 sm:text-base">
          {currentTitle}
        </h1>

        {/* Role badge */}
        {roleMeta && role && (
          <span
            className={`hidden rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider sm:inline-flex ${rolePillClass[role]}`}
          >
            {roleMeta.label}
          </span>
        )}
      </div>

      {/* Header Actions */}
      <div className="relative flex shrink-0 items-center gap-1 sm:gap-2">
        {/* Search */}
        <button
          type="button"
          aria-label="Search"
          title="Search"
          aria-expanded={searchOpen}
          onClick={() => {
            setSearchOpen((open) => !open);
            setSearchQuery("");
          }}
          className="rounded-xl p-2 text-slate-400 transition hover:bg-white/[0.06] hover:text-white sm:p-2.5"
        >
          {searchOpen ? <X size={19} /> : <Search size={19} />}
        </button>

        {role !== "academic_staff" && (
          <Link
            href={settingsHref}
            aria-label="User profile and settings"
            title="User profile and settings"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-gradient-to-br from-violet-500/20 to-cyan-400/10 text-violet-300 transition hover:border-violet-400/30 sm:h-10 sm:w-10"
          >
            <UserRound size={19} />
          </Link>
        )}

        {searchOpen && (
          <div className="absolute right-0 top-full z-50 mt-3 w-[min(90vw,360px)] rounded-2xl border border-white/[0.1] bg-[#11162A] p-3 shadow-xl">
            <label className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#080B18] px-3 py-2.5">
              <Search size={15} className="shrink-0 text-slate-500" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search workspace pages..."
                aria-label="Search workspace pages"
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />
            </label>
            <nav
              aria-label="Workspace search results"
              className="mt-2 max-h-64 overflow-y-auto"
            >
              {searchResults.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSearchOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-sm transition hover:bg-white/[0.06] ${
                    pathname === item.href ? "text-violet-300" : "text-slate-300"
                  }`}
                >
                  {item.title}
                </Link>
              ))}
              {searchResults.length === 0 && (
                <p className="px-3 py-3 text-xs text-slate-500">
                  No workspace pages match that search.
                </p>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
