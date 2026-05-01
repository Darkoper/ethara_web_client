import { motion } from "framer-motion";
import { Calendar, MessageSquare } from "lucide-react";
import { format, isPast } from "date-fns";
import { Task } from "@/lib/types";
import { useApp } from "@/context/AppContext";
import { PriorityBadge } from "./Badges";
import { cn } from "@/lib/utils";

export function TaskCard({ task, onClick, compact = false }: { task: Task; onClick?: () => void; compact?: boolean }) {
  const { users } = useApp();
  const assignee = users.find(u => u.id === task.assigneeId);
  const overdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== "completed";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.01 }}
      onClick={onClick}
      className={cn(
        "group cursor-pointer rounded-xl border border-border/60 bg-card/70 backdrop-blur-xl p-3.5 shadow-sm transition-all hover:border-primary/40 hover:shadow-glow",
        compact && "p-3"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary-glow transition">{task.title}</h4>
        <PriorityBadge priority={task.priority} />
      </div>
      {task.description && !compact && (
        <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">{task.description}</p>
      )}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {assignee && <img src={assignee.avatar} alt={assignee.name} title={assignee.name} className="h-6 w-6 rounded-full bg-secondary ring-2 ring-background" />}
          {task.comments.length > 0 && (
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground"><MessageSquare className="h-3 w-3" />{task.comments.length}</span>
          )}
        </div>
        {task.dueDate && (
          <span className={cn("flex items-center gap-1 text-[11px]", overdue ? "text-rose-400" : "text-muted-foreground")}>
            <Calendar className="h-3 w-3" />
            {format(new Date(task.dueDate), "MMM d")}
          </span>
        )}
      </div>
    </motion.div>
  );
}
