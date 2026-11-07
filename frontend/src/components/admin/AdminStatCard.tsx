"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface AdminStatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: "violet" | "cyan" | "blue" | "emerald" | "amber";
  demoNotice?: boolean;
}

export default function AdminStatCard({
  label,
  value,
  sublabel,
  icon: Icon,
  trend,
  trendUp = true,
  color = "violet",
  demoNotice = true,
}: AdminStatCardProps) {
  const colorStyles = {
    violet: {
      border: "hover:border-violet-500/30",
      bg: "bg-violet-500/10",
      text: "text-violet-400",
      pill: "bg-violet-500/10 text-violet-300",
    },
    cyan: {
      border: "hover:border-cyan-500/30",
      bg: "bg-cyan-500/10",
      text: "text-cyan-400",
      pill: "bg-cyan-500/10 text-cyan-300",
    },
    blue: {
      border: "hover:border-blue-500/30",
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      pill: "bg-blue-500/10 text-blue-300",
    },
    emerald: {
      border: "hover:border-emerald-500/30",
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      pill: "bg-emerald-500/10 text-emerald-300",
    },
    amber: {
      border: "hover:border-amber-500/30",
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      pill: "bg-amber-500/10 text-amber-300",
    },
  };

  const style = colorStyles[color];

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11162A] p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 ${style.border}`}
    >
      <div className="flex items-start justify-between">
        <div className={`rounded-xl p-3 ${style.bg} ${style.text}`}>
          <Icon size={20} />
        </div>

        {trend && (
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
              trendUp
                ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                : "border border-amber-500/20 bg-amber-500/10 text-amber-400"
            }`}
          >
            {trend}
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium text-slate-400">{label}</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {value}
        </p>

        {sublabel && (
          <p className="mt-1.5 text-xs text-slate-500">{sublabel}</p>
        )}
      </div>

      {demoNotice && (
        <div className="mt-3 border-t border-white/[0.04] pt-2 text-[10px] text-slate-600">
          Demonstration Telemetry
        </div>
      )}
    </div>
  );
}
