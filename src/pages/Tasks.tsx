import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, LayoutGrid, List as ListIcon, Search } from "lucide-react";
import { format, isPast } from "date-fns";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { KanbanBoard } from "@/components/KanbanBoard";
import { TaskModal } from "@/components/TaskModal";
import { PriorityBadge, StatusBadge } from "@/components/Badges";
import { EmptyState } from "@/components/EmptyState";
import { cn } from "@/lib/utils";
import type { Task } from "@/lib/types";

export default function Tasks() {
  const { tasks, projects, users, currentUser, isAdmin } = useApp();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    let list = isAdmin ? tasks : tasks.filter(t => t.assigneeId === currentUser?.id);
    if (query) list = list.filter(t => t.title.toLowerCase().includes(query.toLowerCase()));
    return list;
  }, [tasks, query, isAdmin, currentUser]);

  const openEdit = (t: Task) => { setEditing(t); setOpen(true); };
  const openCreate = () => { setEditing(null); setOpen(true); };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Tasks</h1>
          <p className="mt-1 text-muted-foreground">{isAdmin ? "All tasks across your workspace" : "Tasks assigned to you"}</p>
        </div>
        <Button onClick={openCreate} className="bg-aurora text-white border-0 hover:opacity-90 shadow-glow rounded-xl">
          <Plus className="h-4 w-4 mr-1.5" /> New task
        </Button>
      </motion.div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks…" className="pl-9 bg-secondary/40" />
      </div>

      <Tabs defaultValue="kanban">
        <TabsList className="bg-secondary/40">
          <TabsTrigger value="kanban"><LayoutGrid className="h-3.5 w-3.5 mr-1.5" />Kanban</TabsTrigger>
          <TabsTrigger value="list"><ListIcon className="h-3.5 w-3.5 mr-1.5" />List</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="mt-5">
          {visible.length ? <KanbanBoard tasks={visible} onTaskClick={openEdit} onAdd={() => openCreate()} /> : <EmptyState title="No tasks yet" description="Create your first task to start tracking progress." action={<Button onClick={openCreate} className="bg-aurora text-white border-0"><Plus className="h-4 w-4 mr-1.5" />New task</Button>} />}
        </TabsContent>

        <TabsContent value="list" className="mt-5">
          <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl overflow-hidden">
            <div className="grid grid-cols-12 gap-3 px-4 py-3 text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/60">
              <div className="col-span-5">Task</div><div className="col-span-2">Project</div><div className="col-span-1">Status</div><div className="col-span-1">Priority</div><div className="col-span-2">Assignee</div><div className="col-span-1">Due</div>
            </div>
            {visible.map((t, i) => {
              const project = projects.find(p => p.id === t.projectId);
              const assignee = users.find(u => u.id === t.assigneeId);
              const overdue = t.dueDate && isPast(new Date(t.dueDate)) && t.status !== "completed";
              return (
                <motion.button key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} onClick={() => openEdit(t)} className="w-full grid grid-cols-12 gap-3 px-4 py-3 text-left items-center text-sm hover:bg-secondary/40 transition border-b border-border/40 last:border-0">
                  <div className="col-span-5 font-medium truncate">{t.title}</div>
                  <div className="col-span-2 text-muted-foreground truncate">{project?.name}</div>
                  <div className="col-span-1"><StatusBadge status={t.status} /></div>
                  <div className="col-span-1"><PriorityBadge priority={t.priority} /></div>
                  <div className="col-span-2 flex items-center gap-2">{assignee && <><img src={assignee.avatar} className="h-6 w-6 rounded-full bg-secondary" alt="" /><span className="truncate text-xs">{assignee.name}</span></>}</div>
                  <div className={cn("col-span-1 text-xs", overdue && "text-rose-400")}>{t.dueDate && format(new Date(t.dueDate), "MMM d")}</div>
                </motion.button>
              );
            })}
            {!visible.length && <div className="p-12 text-center text-sm text-muted-foreground">No tasks match your search.</div>}
          </div>
        </TabsContent>
      </Tabs>

      <TaskModal open={open} onOpenChange={setOpen} task={editing} />
    </div>
  );
}
