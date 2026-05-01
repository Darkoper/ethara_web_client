import { cn } from "@/lib/utils";
import type { Priority, TaskStatus, ProjectStatus, Role } from "@/lib/types";
import { Crown, User } from "lucide-react";

const priorityStyles: Record<Priority, string> = {
  low: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  medium: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  high: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  urgent: "bg-rose-500/15 text-rose-300 border-rose-500/40",
};
export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  return <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider", priorityStyles[priority], className)}>
    <span className="h-1.5 w-1.5 rounded-full bg-current" />{priority}
  </span>;
}

const statusStyles: Record<TaskStatus, string> = {
  todo: "bg-muted text-muted-foreground border-border",
  in_progress: "bg-primary/15 text-primary-glow border-primary/30",
  in_review: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  completed: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};
const statusLabels: Record<TaskStatus, string> = {
  todo: "Todo", in_progress: "In Progress", in_review: "In Review", completed: "Completed",
};
export function StatusBadge({ status, className }: { status: TaskStatus; className?: string }) {
  return <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium", statusStyles[status], className)}>{statusLabels[status]}</span>;
}

const projectStatusStyles: Record<ProjectStatus, string> = {
  planning: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  active: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  on_hold: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  completed: "bg-violet-500/15 text-violet-300 border-violet-500/30",
};
const projectStatusLabels: Record<ProjectStatus, string> = {
  planning: "Planning", active: "Active", on_hold: "On Hold", completed: "Completed",
};
export function ProjectStatusBadge({ status, className }: { status: ProjectStatus; className?: string }) {
  return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", projectStatusStyles[status], className)}>{projectStatusLabels[status]}</span>;
}

export function RoleBadge({ role, className }: { role: Role; className?: string }) {
  if (role === "admin") return <span className={cn("inline-flex items-center gap-1 rounded-full bg-aurora text-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider shadow-glow", className)}><Crown className="h-3 w-3" /> Admin</span>;
  return <span className={cn("inline-flex items-center gap-1 rounded-full bg-secondary text-secondary-foreground border border-border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", className)}><User className="h-3 w-3" /> Member</span>;
}
