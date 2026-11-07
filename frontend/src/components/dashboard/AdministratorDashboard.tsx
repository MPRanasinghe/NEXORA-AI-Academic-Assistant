
"use client";

import {
  ShieldCheck,
  Users,
  BookOpen,
  Database,
  Activity,
  TrendingUp,
  ArrowUpRight,
  Plus,
  FileText,
  Settings,
  UserCheck,
  Server,
  CircleCheck,
  Clock3,
} from "lucide-react";

import Link from "next/link";

const overviewStats = [
  {
    title: "Total Users",
    value: "1,284",
    description: "Across all platform roles",
    icon: Users,
    color: "violet",
  },
  {
    title: "Knowledge Resources",
    value: "486",
    description: "Indexed academic documents",
    icon: Database,
    color: "cyan",
  },
  {
    title: "AI Assistant Queries",
    value: "8,642",
    description: "Total platform interactions",
    icon: Activity,
    color: "blue",
  },
  {
    title: "Active Courses",
    value: "32",
    description: "Across academic programs",
    icon: BookOpen,
    color: "pink",
  },
];

const userDistribution = [
  { label: "Students", value: 1050, color: "bg-violet-500" },
  { label: "Academic Staff", value: 218, color: "bg-cyan-400" },
  { label: "Administrators", value: 16, color: "bg-blue-400" },
];

const recentActivities = [
  {
    title: "New academic resource uploaded",
    detail: "Database Systems · Academic Staff",
    time: "12 minutes ago",
    icon: FileText,
  },
  {
    title: "New user account created",
    detail: "Student account · Registration",
    time: "34 minutes ago",
    icon: UserCheck,
  },
  {
    title: "Knowledge base updated",
    detail: "Academic documents indexed",
    time: "1 hour ago",
    icon: Database,
  },
  {
    title: "Platform activity recorded",
    detail: "AI Academic Assistant",
    time: "2 hours ago",
    icon: Activity,
  },
];

const systemServices = [
  { name: "Frontend Application", status: "Operational" },
  { name: "Backend API", status: "Demo Status" },
  { name: "Knowledge Retrieval", status: "Demo Status" },
  { name: "Database", status: "Demo Status" },
];

export default function AdministratorDashboard() {
  const totalUsers = userDistribution.reduce(
    (total, role) => total + role.value,
    0
  );

  return (
    <div className="mx-auto max-w-[1440px] space-y-8 p-5 sm:p-8">

      {/* Welcome Section */}
      <section className="relative overflow-hidden rounded-3xl border border-violet-500/15 bg-gradient-to-br from-violet-500/[0.12] via-[#11162A] to-cyan-500/[0.06] p-7 sm:p-10">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-medium text-violet-300">
              <ShieldCheck size={14} />
              Platform Administration
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Welcome back,
              <span className="block bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">
                Administrator!
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
              Manage users, monitor platform activity, oversee academic
              resources, and maintain the NEXORA intelligent academic ecosystem.
            </p>
          </div>

          <Link
            href="/administration"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5"
          >
            Administration Center
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      {/* Demo Data Notice */}
      <div className="flex items-center gap-2 rounded-xl border border-amber-400/15 bg-amber-400/[0.04] px-4 py-3 text-xs text-amber-300/80">
        <Clock3 size={15} />
        Demo statistics — live platform metrics will be connected through the backend.
      </div>

      {/* Platform Statistics */}
      <section>
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-white">
            Platform Overview
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            A high-level view of the NEXORA ecosystem.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {overviewStats.map((stat) => {
            const Icon = stat.icon;

            const iconColors: Record<string, string> = {
              violet: "bg-violet-500/10 text-violet-300",
              cyan: "bg-cyan-400/10 text-cyan-300",
              blue: "bg-blue-400/10 text-blue-300",
              pink: "bg-pink-400/10 text-pink-300",
            };

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-5 transition hover:border-violet-500/20"
              >
                <div className="flex items-center justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconColors[stat.color]}`}>
                    <Icon size={21} />
                  </div>

                  <TrendingUp size={16} className="text-emerald-400" />
                </div>

                <p className="mt-5 text-sm text-slate-400">
                  {stat.title}
                </p>

                <h3 className="mt-1 text-3xl font-bold tracking-tight text-white">
                  {stat.value}
                </h3>

                <p className="mt-2 text-xs text-slate-500">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Analytics */}
      <section className="grid gap-4 lg:grid-cols-2">

        {/* User Distribution */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-6 sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-white">
                User Distribution
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Platform users by role
              </p>
            </div>

            <Users size={20} className="text-violet-300" />
          </div>

          <div className="mt-7">
            <p className="text-3xl font-bold text-white">
              {totalUsers.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Total registered users · Demo data
            </p>
          </div>

          <div className="mt-6 flex h-3 overflow-hidden rounded-full bg-white/[0.04]">
            {userDistribution.map((role) => (
              <div
                key={role.label}
                className={`${role.color} transition-all`}
                style={{
                  width: `${(role.value / totalUsers) * 100}%`,
                }}
              />
            ))}
          </div>

          <div className="mt-6 space-y-4">
            {userDistribution.map((role) => (
              <div
                key={role.label}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className={`h-2.5 w-2.5 rounded-full ${role.color}`} />
                  <span className="text-sm text-slate-400">
                    {role.label}
                  </span>
                </div>

                <span className="text-sm font-medium text-white">
                  {role.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-6 sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-white">
                System Overview
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Platform service monitoring
              </p>
            </div>

            <Server size={20} className="text-cyan-300" />
          </div>

          <div className="mt-7 space-y-4">
            {systemServices.map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <CircleCheck
                    size={17}
                    className="text-emerald-400"
                  />
                  <span className="text-sm text-slate-300">
                    {service.name}
                  </span>
                </div>

                <span className="text-xs text-slate-500">
                  {service.status}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-5 text-xs leading-5 text-slate-500">
            Service availability will be verified using actual backend health checks.
          </p>
        </div>
      </section>

      {/* Administrative Quick Actions */}
      <section>
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-white">
            Administrative Actions
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Frequently used platform management tools.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Manage Users",
              description: "Accounts, roles, and access",
              icon: Users,
              href: "/administration/users",
            },
            {
              title: "Knowledge Base",
              description: "Academic documents and resources",
              icon: Database,
              href: "/administration/knowledge-base",
            },
            {
              title: "Platform Analytics",
              description: "Usage and engagement insights",
              icon: Activity,
              href: "/administration/analytics",
            },
            {
              title: "System Settings",
              description: "Platform configuration",
              icon: Settings,
              href: "/administration/settings",
            },
          ].map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                href={action.href}
                className="group rounded-2xl border border-white/[0.08] bg-[#11162A] p-5 transition duration-300 hover:-translate-y-1 hover:border-violet-500/25 hover:bg-[#171D35]"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300 transition group-hover:bg-violet-500/15">
                    <Icon size={21} />
                  </div>

                  <ArrowUpRight
                    size={17}
                    className="text-slate-600 transition group-hover:text-violet-300"
                  />
                </div>

                <h4 className="font-semibold text-white">
                  {action.title}
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {action.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-6 sm:p-7">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white">
              Recent Platform Activity
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Latest administrative and academic events
            </p>
          </div>

          <Activity size={20} className="text-violet-300" />
        </div>

        <div className="space-y-4">
          {recentActivities.map((activity) => {
            const Icon = activity.icon;

            return (
              <div
                key={activity.title}
                className="flex items-start gap-4 rounded-xl border border-white/[0.05] bg-white/[0.02] p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                  <Icon size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-200">
                    {activity.title}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {activity.detail}
                  </p>
                </div>

                <span className="shrink-0 text-xs text-slate-500">
                  {activity.time}
                </span>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
