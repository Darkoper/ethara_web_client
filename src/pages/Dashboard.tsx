import { motion } from "framer-motion";
import { FolderKanban, ListChecks, CheckCircle2, Clock, AlertTriangle, Plus, Calendar as CalIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { format, isPast, differenceInDays } from "date-fns";
import { useApp } from "@/context/AppContext";
import { StatCard } from "@/components/StatCard";
import { ActivityTimeline } from "@/components/ActivityTimeline";
import { ProgressBar, ProgressRing } from "@/components/Progress";
import { Button } from "@/components/ui/button";
import { ProjectModal } from "@/components/ProjectModal";
import { PriorityBadge } from "@/components/Badges";
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";

export default function Dashboard() {
  const { projects, tasks, activities, currentUser, isAdmin } = useApp();
  const [projectOpen, setProjectOpen] = useState(false);

  const visibleTasks = isAdmin ? tasks : tasks.filter(t => t.assigneeId === currentUser?.id);
  const visibleProjects = isAdmin ? projects : projects.filter(p => p.memberIds.includes(currentUser!.id));

  const completed = visibleTasks.filter(t => t.status === "completed").length;
  const pending = visibleTasks.filter(t => t.status !== "completed").length;
  const overdue = visibleTasks.filter(t => t.dueDate && isPast(new Date(t.dueDate)) && t.status !== "completed").length;

  const upcoming = [...visibleTasks]
    .filter(t => t.status !== "completed" && t.dueDate)
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 5);

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return {
      day: format(d, "EEE"),
      completed: Math.floor(Math.random() * 6) + 2,
      created: Math.floor(Math.random() * 5) + 1,
    };
  });

  const statusData = [
    { name: "Todo", value: visibleTasks.filter(t => t.status === "todo").length },
    { name: "In Progress", value: visibleTasks.filter(t => t.status === "in_progress").length },
    { name: "In Review", value: visibleTasks.filter(t => t.status === "in_review").length },
    { name: "Done", value: completed },
  ];

  const overallProgress = visibleTasks.length ? (completed / visibleTasks.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl">Welcome back, <span className="text-gradient">{currentUser?.name.split(" ")[0]}</span></h1>
          <p className="mt-1.5 text-muted-foreground">Here's what's happening across your workspace today.</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setProjectOpen(true)} className="bg-aurora text-white border-0 hover:opacity-90 shadow-glow rounded-xl">
            <Plus className="h-4 w-4 mr-1.5" /> New project
          </Button>
        )}
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={FolderKanban} label="Projects" value={visibleProjects.length} change={12} accent="primary" index={0} />
        <StatCard icon={ListChecks} label="Total tasks" value={visibleTasks.length} change={8} accent="primary" index={1} />
        <StatCard icon={CheckCircle2} label="Completed" value={completed} change={24} accent="success" index={2} />
        <StatCard icon={Clock} label="Pending" value={pending} change={-5} accent="warning" index={3} />
        <StatCard icon={AlertTriangle} label="Overdue" value={overdue} change={overdue > 0 ? 18 : 0} accent="destructive" index={4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl p-5 shadow-elegant">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-2xl">Velocity</h3>
              <p className="text-xs text-muted-foreground">Tasks created vs. completed this week</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={last7}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(260 90% 70%)" stopOpacity={0.5} /><stop offset="100%" stopColor="hsl(260 90% 70%)" stopOpacity={0} /></linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(152 70% 50%)" stopOpacity={0.4} /><stop offset="100%" stopColor="hsl(152 70% 50%)" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                <Area type="monotone" dataKey="created" stroke="hsl(260 90% 70%)" strokeWidth={2} fill="url(#g1)" />
                <Area type="monotone" dataKey="completed" stroke="hsl(152 70% 50%)" strokeWidth={2} fill="url(#g2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl p-5 shadow-elegant">
          <h3 className="font-display text-2xl">Overall progress</h3>
          <div className="mt-4 flex items-center gap-5">
            <ProgressRing value={overallProgress} size={110} stroke={9} />
            <div className="space-y-1.5 flex-1">
              {statusData.map(s => (
                <div key={s.name}>
                  <div className="flex justify-between text-xs"><span className="text-muted-foreground">{s.name}</span><span className="font-medium">{s.value}</span></div>
                  <ProgressBar value={visibleTasks.length ? (s.value / visibleTasks.length) * 100 : 0} className="h-1" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl p-5 shadow-elegant">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-2xl">Upcoming deadlines</h3>
            <Link to="/tasks" className="text-xs text-primary-glow hover:underline">View all</Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Nothing on the horizon — enjoy the calm ✨</p>
          ) : (
            <div className="space-y-2">
              {upcoming.map((t, i) => {
                const project = projects.find(p => p.id === t.projectId);
                const days = differenceInDays(new Date(t.dueDate!), new Date());
                return (
                  <motion.div key={t.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }} className="flex items-center gap-3 rounded-xl border border-border/40 bg-secondary/30 p-3 hover:bg-secondary/60 transition">
                    <CalIcon className="h-4 w-4 text-primary-glow shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate">{t.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{project?.name}</div>
                    </div>
                    <PriorityBadge priority={t.priority} />
                    <div className={`text-xs font-medium ${days < 0 ? "text-rose-400" : days <= 2 ? "text-amber-300" : "text-muted-foreground"}`}>
                      {days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? "Today" : `${days}d`}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl p-5 shadow-elegant">
          <h3 className="font-display text-2xl mb-4">Recent activity</h3>
          <ActivityTimeline activities={activities} limit={5} />
        </motion.div>
      </div>

      <ProjectModal open={projectOpen} onOpenChange={setProjectOpen} />
    </div>
  );
}
