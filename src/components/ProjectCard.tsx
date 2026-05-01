import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { Project, Task } from "@/lib/types";
import { ProjectStatusBadge, PriorityBadge } from "./Badges";
import { ProgressBar } from "./Progress";
import { AvatarStack } from "./AvatarStack";
import { cn } from "@/lib/utils";

export function ProjectCard({ project, tasks, index = 0 }: { project: Project; tasks: Task[]; index?: number }) {
  const projectTasks = tasks.filter(t => t.projectId === project.id);
  const completed = projectTasks.filter(t => t.status === "completed").length;
  const progress = projectTasks.length ? (completed / projectTasks.length) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.45 }}
      whileHover={{ y: -4 }}
    >
      <Link to={`/projects/${project.id}`} className="block">
        <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl p-5 shadow-elegant transition-all hover:border-primary/40 hover:shadow-glow">
          <div className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-80", project.color)} />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <ProjectStatusBadge status={project.status} />
                <PriorityBadge priority={project.priority} />
              </div>
              <h3 className="mt-3 font-display text-xl truncate group-hover:text-primary-glow transition">{project.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{project.description}</p>
            </div>
            <button className="opacity-0 group-hover:opacity-100 transition rounded-lg p-1.5 hover:bg-secondary" onClick={(e) => e.preventDefault()}>
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(progress)}% · {completed}/{projectTasks.length}</span>
            </div>
            <ProgressBar value={progress} />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <AvatarStack ids={project.memberIds} />
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {format(new Date(project.dueDate), "MMM d, yyyy")}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
