"use client";

import React from "react";
import { CheckCircle2, Clock, AlertTriangle, XCircle } from "lucide-react";

export type StatusType =
  | "Indexed"
  | "Processing"
  | "Uploaded"
  | "Failed"
  | "Success"
  | "Running"
  | "Completed"
  | "Iterating"
  | "Pending";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

export default function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const getStyle = (statusStr: string) => {
    switch (statusStr.toLowerCase()) {
      case "indexed":
      case "success":
      case "completed":
        return {
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/20",
          text: "text-emerald-400",
          icon: CheckCircle2,
        };
      case "processing":
      case "running":
      case "iterating":
        return {
          bg: "bg-cyan-500/10",
          border: "border-cyan-500/20",
          text: "text-cyan-400",
          icon: Clock,
        };
      case "uploaded":
      case "pending":
        return {
          bg: "bg-violet-500/10",
          border: "border-violet-500/20",
          text: "text-violet-400",
          icon: Clock,
        };
      case "failed":
        return {
          bg: "bg-red-500/10",
          border: "border-red-500/20",
          text: "text-red-400",
          icon: XCircle,
        };
      default:
        return {
          bg: "bg-slate-500/10",
          border: "border-slate-500/20",
          text: "text-slate-400",
          icon: Clock,
        };
    }
  };

  const style = getStyle(status);
  const Icon = style.icon;
  const sizeClasses = size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${sizeClasses} ${style.bg} ${style.border} ${style.text}`}
    >
      <Icon size={size === "sm" ? 12 : 14} />
      <span>{status}</span>
    </span>
  );
}
