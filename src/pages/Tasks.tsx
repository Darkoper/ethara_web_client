import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Eye, LayoutGrid, List as ListIcon, Plus, Search, SlidersHorizontal, UserRound } from "lucide-react";
import { format, isPast } from "date-fns";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [view, setView] = useState("kanban");

  const visible = useMemo(() => {
    let list = isAdmin ? tasks : tasks.filter(t => t.assigneeId === currentUser?.id);
    if (query) list = list.filter(t => t.title.toLowerCase().includes(query.toLowerCase()));
    return list;
  }, [tasks, query, isAdmin, currentUser]);

  const openEdit = (t: Task) => { setEditing(t); setOpen(true); };
  const openCreate = () => { setEditing(null); setOpen(true); };

  return (
    <div className="space-y-5">
      <Tabs value={view} onValueChange={setView} className="space-y-5">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-normal">Tasks</h1>
            <p className="mt-1 text-sm text-muted-foreground">{isAdmin ? "All tasks across your workspace" : "Tasks assigned to you"}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <TabsList className="h-10 rounded-lg border border-border bg-card p-1">
              <TabsTrigger value="list" className="h-8 rounded-md px-3"><ListIcon className="mr-1.5 h-3.5 w-3.5" />List</TabsTrigger>
              <TabsTrigger value="kanban" className="h-8 rounded-md px-3"><LayoutGrid className="mr-1.5 h-3.5 w-3.5" />Board</TabsTrigger>
            </TabsList>
            <Button onClick={openCreate} className="h-10 rounded-lg bg-primary text-white hover:bg-primary/90">
              <Plus className="mr-1.5 h-4 w-4" /> New task
            </Button>
          </div>
        </motion.div>

        <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3 md:flex-row md:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks..." className="h-10 border-0 bg-transparent pl-9 shadow-none focus-visible:ring-0" />
          </div>
          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3 md:border-l md:border-t-0 md:pl-3 md:pt-0">
            <button className="inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
            <button className="inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground">
              <UserRound className="h-4 w-4" /> Me
            </button>
            <button className="inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground">
              <Eye className="h-4 w-4" /> Show
            </button>
          </div>
        </div>

        <TabsContent value="kanban" className="mt-0">
          {visible.length ? (
            <KanbanBoard tasks={visible} onTaskClick={openEdit} onAdd={() => openCreate()} />
          ) : (
            <EmptyState title="No tasks yet" description="Create your first task to start tracking progress." action={<Button onClick={openCreate} className="border-0 bg-primary text-white"><Plus className="mr-1.5 h-4 w-4" />New task</Button>} />
          )}
        </TabsContent>

        <TabsContent value="list" className="mt-0">
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="grid grid-cols-12 gap-3 border-b border-border px-4 py-3 text-[11px] uppercase tracking-wider text-muted-foreground">
              <div className="col-span-5">Task</div><div className="col-span-2">Project</div><div className="col-span-1">Status</div><div className="col-span-1">Priority</div><div className="col-span-2">Assignee</div><div className="col-span-1">Due</div>
            </div>
            {visible.map((t, i) => {
              const project = projects.find(p => p.id === t.projectId);
              const assignee = users.find(u => u.id === t.assigneeId);
              const overdue = t.dueDate && isPast(new Date(t.dueDate)) && t.status !== "completed";
              return (
                <motion.button key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} onClick={() => openEdit(t)} className="grid w-full grid-cols-12 items-center gap-3 border-b border-border/70 px-4 py-3 text-left text-sm transition last:border-0 hover:bg-secondary/60">
                  <div className="col-span-5 truncate font-medium">{t.title}</div>
                  <div className="col-span-2 truncate text-muted-foreground">{project?.name}</div>
                  <div className="col-span-1"><StatusBadge status={t.status} /></div>
                  <div className="col-span-1"><PriorityBadge priority={t.priority} /></div>
                  <div className="col-span-2 flex items-center gap-2">{assignee && <><img src={assignee.avatar} className="h-6 w-6 rounded-full bg-secondary" alt="" /><span className="truncate text-xs">{assignee.name}</span></>}</div>
                  <div className={cn("col-span-1 text-xs", overdue && "text-rose-600")}>{t.dueDate && format(new Date(t.dueDate), "MMM d")}</div>
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
