
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  NotebookPen,
  GraduationCap,
  Settings,
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  ChevronRight,
  Sparkles,
} from "lucide-react";

type UserRole = "student" | "academic_staff" | "administrator";

interface WorkspaceSidebarProps {
  role?: UserRole;
}

export default function WorkspaceSidebar({
  role = "student",
}: WorkspaceSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const sharedNavigation = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "AI Assistant",
      href: "/assistant",
      icon: null,
    },
    {
      label: "Learning",
      href: "/learning",
      icon: BookOpen,
    },
    {
      label: "Quizzes",
      href: "/quizzes",
      icon: ClipboardList,
    },
    {
      label: "Notes",
      href: "/notes",
      icon: NotebookPen,
    },
    {
      label: "Academic Services",
      href: "/academic",
      icon: GraduationCap,
    },
  ];

  const roleNavigation = {
    student: [],
    academic_staff: [
      {
        label: "Quiz Management",
        href: "/quizzes/manage",
        icon: ClipboardList,
      },
    ],
    administrator: [
      {
        label: "Administration",
        href: "/administration",
        icon: ShieldCheck,
      },
    ],
  };

  const navigation = [
    ...sharedNavigation,
    ...roleNavigation[role],
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside
      className={`relative flex h-screen flex-col border-r border-white/[0.08] bg-[#0D1225] transition-all duration-300 ${
        collapsed ? "w-[76px]" : "w-[260px]"
      }`}
    >
      {/* Branding */}
      <div
        className={`flex h-[84px] items-center border-b border-white/[0.08] ${
          collapsed ? "justify-center px-3" : "px-6"
        }`}
      >
        <Link
          href="/dashboard"
          className="flex items-center gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-lg shadow-violet-500/20">
              <span className="text-xl font-black text-white">N</span>
            </div>

            {!collapsed && (
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold tracking-wide text-white">
                  NEXORA
                </span>
                
              </div>
            )}
          </div>
        </Link>
      </div>

      {/* Collapse Button */}
      <div
        className={`flex py-4 ${
          collapsed ? "justify-center" : "justify-end px-4"
        }`}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
        >
          {collapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {!collapsed && (
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Workspace
          </p>
        )}

        {navigation.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          const isAssistant = item.href === "/assistant";

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`group flex items-center gap-3 rounded-xl px-3 py-3 transition-all ${
                collapsed ? "justify-center" : ""
              } ${
                active
                  ? "bg-violet-500/15 text-violet-300 shadow-[inset_0_0_0_1px_rgba(139,92,246,0.15)]"
                  : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              {/* AI Assistant NEXORA Icon */}
              {isAssistant ? (
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-cyan-400">
                  <span className="text-[11px] font-black leading-none text-white">
                    N
                  </span>
                </div>
              ) : (
                Icon && (
                  <Icon
                    size={20}
                    className={`shrink-0 ${
                      active
                        ? "text-violet-400"
                        : "group-hover:text-cyan-300"
                    }`}
                  />
                )
              )}

              {!collapsed && (
                <>
                  <span className="flex-1 text-sm font-medium">
                    {item.label}
                  </span>

                  {active && (
                    <ChevronRight
                      size={15}
                      className="text-violet-400"
                    />
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="space-y-1 border-t border-white/[0.08] p-3">
        <Link
          href="/settings"
          title={collapsed ? "Settings" : undefined}
          className={`flex items-center gap-3 rounded-xl px-3 py-3 text-slate-400 transition hover:bg-white/[0.05] hover:text-white ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <Settings size={20} className="shrink-0" />

          {!collapsed && (
            <span className="text-sm font-medium">Settings</span>
          )}
        </Link>

        <button
          title={collapsed ? "Sign out" : undefined}
          onClick={() => alert("Authentication integration coming soon.")}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut size={20} className="shrink-0" />

          {!collapsed && (
            <span className="text-sm font-medium">Sign out</span>
          )}
        </button>
      </div>
    </aside>
  );
}
