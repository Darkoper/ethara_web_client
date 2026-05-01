import { motion, AnimatePresence } from "framer-motion";
import { Task, TaskStatus } from "@/lib/types";
import { TaskCard } from "./TaskCard";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";

const columns: { id: TaskStatus; label: string; color: string }[] = [
  { id: "todo", label: "Todo", color: "bg-muted-foreground/60" },
  { id: "in_progress", label: "In Progress", color: "bg-primary" },
  { id: "in_review", label: "In Review", color: "bg-violet-400" },
  { id: "completed", label: "Completed", color: "bg-emerald-400" },
];

export function KanbanBoard({ tasks, onTaskClick, onAdd }: { tasks: Task[]; onTaskClick?: (t: Task) => void; onAdd?: (status: TaskStatus) => void }) {
  const { updateTask, isAdmin } = useApp();

  const onDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
  };
  const onDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (id) updateTask(id, { status });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {columns.map(col => {
        const colTasks = tasks.filter(t => t.status === col.id);
        return (
          <div
            key={col.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, col.id)}
            className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-xl p-3 min-h-[400px]"
          >
            <div className="flex items-center justify-between px-1.5 mb-3">
              <div className="flex items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full", col.color)} />
                <span className="text-sm font-semibold">{col.label}</span>
                <span className="text-xs text-muted-foreground">{colTasks.length}</span>
              </div>
              {isAdmin && onAdd && (
                <button onClick={() => onAdd(col.id)} className="rounded-md p-1 hover:bg-secondary"><Plus className="h-3.5 w-3.5" /></button>
              )}
            </div>
            <div className="space-y-2">
              <AnimatePresence>
                {colTasks.map(task => (
                  <motion.div key={task.id} layout draggable onDragStart={(e) => onDragStart(e as any, task.id)}>
                    <TaskCard task={task} onClick={() => onTaskClick?.(task)} compact />
                  </motion.div>
                ))}
              </AnimatePresence>
              {colTasks.length === 0 && (
                <div className="rounded-xl border border-dashed border-border/60 p-6 text-center text-xs text-muted-foreground">Drop tasks here</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
