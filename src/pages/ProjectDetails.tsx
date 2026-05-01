import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Settings, Calendar, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProjectStatusBadge, PriorityBadge } from "@/components/Badges";
import { ProgressRing, ProgressBar } from "@/components/Progress";
import { AvatarStack } from "@/components/AvatarStack";
import { KanbanBoard } from "@/components/KanbanBoard";
import { TaskCard } from "@/components/TaskCard";
import { TaskModal } from "@/components/TaskModal";
import { ProjectModal } from "@/components/ProjectModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ActivityTimeline } from "@/components/ActivityTimeline";
import { EmptyState } from "@/components/EmptyState";
import { toast } from "sonner";
import type { Task, TaskStatus } from "@/lib/types";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, tasks, activities, users, isAdmin, deleteProject } = useApp();
  const project = projects.find(p => p.id === id);

  const [taskOpen, setTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>("todo");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  const projectTasks = useMemo(() => tasks.filter(t => t.projectId === id), [tasks, id]);
  const projectActivities = useMemo(() => activities.filter(a => a.projectId === id), [activities, id]);
  const completed = projectTasks.filter(t => t.status === "completed").length;
  const progress = projectTasks.length ? (completed / projectTasks.length) * 100 : 0;

  if (!project) {
    return <EmptyState title="Project not found" description="It may have been removed or you don't have access." action={<Link to="/projects"><Button variant="secondary">Back to projects</Button></Link>} />;
  }

  const openCreate = (status: TaskStatus) => { setEditingTask(null); setDefaultStatus(status); setTaskOpen(true); };
  const openEdit = (t: Task) => { setEditingTask(t); setTaskOpen(true); };

  const handleDelete = () => {
    deleteProject(project.id);
    toast.success("Project deleted");
    navigate("/projects");
  };

  return (
    <div className="space-y-6">
      <Link to="/projects" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"><ArrowLeft className="h-4 w-4" /> Projects</Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl p-6 shadow-elegant`}>
        <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${project.color}`} />
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <ProjectStatusBadge status={project.status} />
              <PriorityBadge priority={project.priority} />
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="h-3 w-3" /> Due {format(new Date(project.dueDate), "MMM d, yyyy")}</span>
            </div>
            <h1 className="mt-3 font-display text-4xl">{project.name}</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{project.description}</p>
            <div className="mt-4 flex items-center gap-3"><AvatarStack ids={project.memberIds} size={32} /><span className="text-xs text-muted-foreground">{project.memberIds.length} members</span></div>
          </div>
          <div className="flex items-center gap-4">
            <ProgressRing value={progress} size={84} stroke={7} />
            {isAdmin && (
              <div className="flex flex-col gap-2">
                <Button variant="secondary" size="sm" onClick={() => setSettingsOpen(true)}><Settings className="h-3.5 w-3.5 mr-1.5" />Settings</Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => setConfirmDel(true)}><Trash2 className="h-3.5 w-3.5 mr-1.5" />Delete</Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="tasks">
        <TabsList className="bg-secondary/40">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["todo","in_progress","in_review","completed"] as TaskStatus[]).map(s => {
            const c = projectTasks.filter(t => t.status === s).length;
            return (
              <div key={s} className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl p-5">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.replace("_", " ")}</div>
                <div className="mt-1 font-display text-3xl">{c}</div>
                <ProgressBar value={projectTasks.length ? (c / projectTasks.length) * 100 : 0} className="mt-3" />
              </div>
            );
          })}
        </TabsContent>

        <TabsContent value="tasks" className="mt-5 space-y-4">
          {isAdmin && (
            <div className="flex justify-end"><Button onClick={() => openCreate("todo")} className="bg-aurora text-white border-0 hover:opacity-90"><Plus className="h-4 w-4 mr-1.5" />New task</Button></div>
          )}
          <KanbanBoard tasks={projectTasks} onTaskClick={openEdit} onAdd={openCreate} />
        </TabsContent>

        <TabsContent value="team" className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {project.memberIds.map(id => {
            const u = users.find(x => x.id === id);
            if (!u) return null;
            const userTasks = projectTasks.filter(t => t.assigneeId === u.id);
            return (
              <div key={u.id} className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl p-4 flex items-center gap-3">
                <img src={u.avatar} alt="" className="h-12 w-12 rounded-xl bg-secondary" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">{u.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{u.title}</div>
                  <div className="text-xs mt-1">{userTasks.length} tasks</div>
                </div>
              </div>
            );
          })}
        </TabsContent>

        <TabsContent value="activity" className="mt-5">
          <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl p-5">
            {projectActivities.length ? <ActivityTimeline activities={projectActivities} /> : <p className="text-sm text-muted-foreground py-6 text-center">No activity yet.</p>}
          </div>
        </TabsContent>
      </Tabs>

      <TaskModal open={taskOpen} onOpenChange={setTaskOpen} task={editingTask} defaultProjectId={project.id} defaultStatus={defaultStatus} />
      <ProjectModal open={settingsOpen} onOpenChange={setSettingsOpen} project={project} />
      <ConfirmDialog open={confirmDel} onOpenChange={setConfirmDel} title="Delete project?" description="This will permanently remove the project and its tasks." confirmText="Delete" onConfirm={handleDelete} destructive />
    </div>
  );
}
