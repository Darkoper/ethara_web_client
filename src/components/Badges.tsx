import { cn } from "@/lib/utils";
import type { Priority, TaskStatus, ProjectStatus, Role } from "@/lib/types";
import { Crown, User } from "lucide-react";

const priorityStyles: Record<Priority, string> = {
  low: "bg-sky-50 text-sky-700 border-sky-100",
  medium: "bg-red-500/10 text-red-200 border-red-500/20",
  high: "bg-red-500/15 text-red-100 border-red-500/30",
  urgent: "bg-rose-50 text-rose-700 border-rose-100",
};
export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  return <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize", priorityStyles[priority], className)}>
    {priority}
  </span>;
}

const statusStyles: Record<TaskStatus, string> = {
  todo: "bg-muted text-muted-foreground border-border",
  in_progress: "bg-primary/15 text-primary-glow border-primary/30",
  in_review: "bg-rose-500/15 text-rose-200 border-rose-500/30",
  completed: "bg-red-500/15 text-red-200 border-red-500/30",
};
const statusLabels: Record<TaskStatus, string> = {
  todo: "Todo", in_progress: "In Progress", in_review: "In Review", completed: "Completed",
};
export function StatusBadge({ status, className }: { status: TaskStatus; className?: string }) {
  return <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium", statusStyles[status], className)}>{statusLabels[status]}</span>;
}

const projectStatusStyles: Record<ProjectStatus, string> = {
  planning: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  active: "bg-red-500/15 text-red-200 border-red-500/30",
  on_hold: "bg-rose-500/15 text-rose-200 border-rose-500/30",
  completed: "bg-red-600/15 text-red-200 border-red-600/30",
};
const projectStatusLabels: Record<ProjectStatus, string> = {
  planning: "Planning", active: "Active", on_hold: "On Hold", completed: "Completed",
};
export function ProjectStatusBadge({ status, className }: { status: ProjectStatus; className?: string }) {
  return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", projectStatusStyles[status], className)}>{projectStatusLabels[status]}</span>;
}

export function RoleBadge({ role, className }: { role: Role; className?: string }) {
  if (role === "admin") return <span className={cn("inline-flex items-center gap-1 rounded-full bg-primary text-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", className)}><Crown className="h-3 w-3" /> Admin</span>;
  return <span className={cn("inline-flex items-center gap-1 rounded-full bg-secondary text-secondary-foreground border border-border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", className)}><User className="h-3 w-3" /> Member</span>;
}
