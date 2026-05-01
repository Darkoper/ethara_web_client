import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend, RadialBarChart, RadialBar } from "recharts";
import { ProgressBar } from "@/components/Progress";

const COLORS = ["hsl(260 90% 70%)", "hsl(220 90% 65%)", "hsl(280 90% 75%)", "hsl(152 70% 50%)", "hsl(38 95% 60%)", "hsl(0 75% 60%)"];

export default function Reports() {
  const { projects, tasks, users } = useApp();

  const byStatus = [
    { name: "Todo", value: tasks.filter(t => t.status === "todo").length },
    { name: "In Progress", value: tasks.filter(t => t.status === "in_progress").length },
    { name: "In Review", value: tasks.filter(t => t.status === "in_review").length },
    { name: "Completed", value: tasks.filter(t => t.status === "completed").length },
  ];

  const byPriority = ["urgent","high","medium","low"].map(p => ({ name: p, value: tasks.filter(t => t.priority === p).length }));

  const byMember = users.map(u => ({
    name: u.name.split(" ")[0],
    completed: tasks.filter(t => t.assigneeId === u.id && t.status === "completed").length,
    pending: tasks.filter(t => t.assigneeId === u.id && t.status !== "completed").length,
  }));

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-4xl">Reports</h1>
        <p className="mt-1 text-muted-foreground">Insights across projects, tasks, and the team.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl p-5">
          <h3 className="font-display text-2xl mb-4">Tasks by status</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={byStatus} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={4}>
                  {byStatus.map((_, i) => <Cell key={i} fill={COLORS[i]} stroke="hsl(var(--background))" strokeWidth={3} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl p-5">
          <h3 className="font-display text-2xl mb-4">Tasks by priority</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={byPriority}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {byPriority.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl p-5">
        <h3 className="font-display text-2xl mb-4">Workload by member</h3>
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={byMember}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
              <Legend />
              <Bar dataKey="completed" stackId="a" fill="hsl(152 70% 50%)" radius={[0,0,0,0]} />
              <Bar dataKey="pending" stackId="a" fill="hsl(260 90% 70%)" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl p-5">
        <h3 className="font-display text-2xl mb-4">Project health</h3>
        <div className="space-y-3">
          {projects.map(p => {
            const pTasks = tasks.filter(t => t.projectId === p.id);
            const done = pTasks.filter(t => t.status === "completed").length;
            const pct = pTasks.length ? (done / pTasks.length) * 100 : 0;
            return (
              <div key={p.id}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium">{p.name}</span>
                  <span className="text-muted-foreground">{Math.round(pct)}% · {done}/{pTasks.length}</span>
                </div>
                <ProgressBar value={pct} />
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
