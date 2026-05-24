import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  FolderKanban,
  ListChecks,
  LockKeyhole,
  MessageSquareText,
  Sparkles,
  Users,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";

const lanes = [
  {
    title: "Planning",
    count: 4,
    tasks: ["Scope client portal", "Map owner approvals"],
  },
  {
    title: "In progress",
    count: 7,
    tasks: ["Build task filters", "QA notification rules"],
  },
  {
    title: "Review",
    count: 3,
    tasks: ["Reports polish", "Calendar handoff"],
  },
];

const metrics = [
  { label: "Projects", value: "18", icon: FolderKanban },
  { label: "Tasks shipped", value: "312", icon: CheckCircle2 },
  { label: "Team members", value: "42", icon: Users },
  { label: "Reports", value: "24", icon: BarChart3 },
];

const features = [
  { title: "Project command center", text: "Plan owners, deadlines, priorities, team members, and status without jumping tabs.", icon: FolderKanban },
  { title: "Task flow that stays visible", text: "Kanban, task lists, comments, and due dates stay connected to the same project record.", icon: ListChecks },
  { title: "Team access with control", text: "Admin and member views keep collaboration clean while protecting workspace actions.", icon: LockKeyhole },
  { title: "Reports without drama", text: "Progress, overdue work, team load, and completion trends are ready when you need them.", icon: BarChart3 },
];

export default function Index() {
  const { currentUser } = useApp();
  const workspaceHref = currentUser ? "/dashboard" : "/login";

  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(to_right,hsl(var(--border)/0.28)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.22)_1px,transparent_1px)] bg-[size:72px_72px]" />

      <header className="fixed inset-x-0 top-0 z-30 border-b border-border/70 bg-background/88 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <BrandLogo className="h-9 w-9 rounded-lg shadow-none" iconClassName="h-5 w-5" />
            <div className="leading-none">
              <div className="font-display text-base">Ethara</div>
              <div className="mt-1 text-[11px] text-muted-foreground">Project OS</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#platform" className="transition hover:text-foreground">Platform</a>
            <a href="#workflow" className="transition hover:text-foreground">Workflow</a>
            <a href="#reports" className="transition hover:text-foreground">Reports</a>
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/login" className="hidden text-sm font-medium text-muted-foreground transition hover:text-foreground sm:inline-flex">
              Sign in
            </Link>
            <Button asChild className="h-9 rounded-lg border-0 bg-aurora px-4 text-white shadow-glow hover:opacity-90">
              <Link to={workspaceHref}>{currentUser ? "Open workspace" : "Get started"}</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="px-4 pb-14 pt-28 sm:px-6 lg:px-8">
          <div className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary-glow" />
                Built for project teams, not spreadsheet juggling
              </div>
              <h1 className="font-display text-5xl leading-[0.98] sm:text-6xl lg:text-7xl xl:text-8xl">
                Ethara Workspace
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                A dark, focused project management platform for planning work, assigning teams, tracking deadlines, and shipping with clean visibility.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="h-11 rounded-lg border-0 bg-aurora px-5 text-white shadow-glow hover:opacity-90">
                  <Link to={workspaceHref}>
                    {currentUser ? "Open dashboard" : "Start managing work"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" className="h-11 rounded-lg px-5">
                  <a href="#platform">See the platform</a>
                </Button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.6 }} className="relative">
              <div className="rounded-2xl border border-border bg-card/80 p-4 shadow-elegant backdrop-blur">
                <div className="mb-4 flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <div className="text-xs uppercase text-muted-foreground">Live command board</div>
                    <div className="mt-1 font-display text-2xl">Launch Operations</div>
                  </div>
                  <div className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-primary-glow">86% healthy</div>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  {lanes.map((lane) => (
                    <div key={lane.title} className="rounded-xl border border-border bg-background/75 p-3">
                      <div className="mb-3 flex items-center justify-between text-xs">
                        <span className="font-semibold">{lane.title}</span>
                        <span className="text-muted-foreground">{lane.count}</span>
                      </div>
                      <div className="space-y-3">
                        {lane.tasks.map((task, taskIndex) => (
                          <div key={task} className="rounded-lg border border-border bg-card p-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="text-sm font-medium leading-5">{task}</div>
                              <span className="mt-1 h-2 w-2 rounded-full bg-success" />
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                              <div className="flex -space-x-1.5">
                                <span className="h-6 w-6 rounded-full bg-primary ring-2 ring-card" />
                                <span className="h-6 w-6 rounded-full bg-success ring-2 ring-card" />
                              </div>
                              <span className="rounded-md bg-secondary px-2 py-1 text-[10px] text-muted-foreground">
                                {taskIndex === 0 ? "High" : "Medium"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-[0.85fr_1.15fr]">
                  <div className="rounded-xl border border-border bg-background/75 p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                      <CalendarClock className="h-4 w-4 text-primary-glow" />
                      Upcoming
                    </div>
                    <div className="space-y-3 text-xs">
                      {["Design review", "API handoff", "Sprint close"].map((item, index) => (
                        <div key={item} className="flex items-center justify-between">
                          <span className="text-muted-foreground">{item}</span>
                          <span>{index + 1}d</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-background/75 p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="text-sm font-semibold">Team velocity</div>
                      <BarChart3 className="h-4 w-4 text-primary-glow" />
                    </div>
                    <div className="flex h-24 items-end gap-2">
                      {[44, 68, 52, 86, 62, 94, 72].map((height, index) => (
                        <div key={index} className="flex-1 rounded-t bg-primary/85" style={{ height: `${height}%` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="platform" className="border-y border-border bg-card/35 px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-xl border border-border bg-background/80 p-5">
                <metric.icon className="h-5 w-5 text-primary-glow" />
                <div className="mt-5 font-display text-4xl">{metric.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{metric.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="workflow" className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <h2 className="font-display text-4xl sm:text-5xl">Everything around the project.</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Ethara keeps project records, tasks, members, comments, notifications, calendars, and reports in one dark workspace.
              </p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-xl border border-border bg-card p-5 shadow-elegant">
                  <feature.icon className="h-5 w-5 text-primary-glow" />
                  <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="reports" className="px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 rounded-2xl border border-border bg-card p-5 shadow-elegant lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
            <div>
              <div className="mb-4 inline-flex rounded-lg border border-border bg-background px-3 py-1 text-xs text-primary-glow">Reports + access</div>
              <h2 className="font-display text-4xl sm:text-5xl">See risk before it becomes noise.</h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
                Track overdue tasks, project progress, team workload, and admin-only actions with the same interface your team already uses.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-background/75 p-4">
                  <MessageSquareText className="h-5 w-5 text-success" />
                  <div className="mt-3 text-sm font-semibold">Context stays attached</div>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">Comments and notifications stay with the task.</p>
                </div>
                <div className="rounded-xl border border-border bg-background/75 p-4">
                  <LockKeyhole className="h-5 w-5 text-primary-glow" />
                  <div className="mt-3 text-sm font-semibold">Clean role boundaries</div>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">Admins manage, members execute, reports stay readable.</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background/80 p-4">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">Workspace snapshot</div>
                  <div className="mt-1 text-xl font-semibold">Delivery health</div>
                </div>
                <span className="rounded-lg bg-accent px-3 py-1 text-xs text-accent-foreground">On track</span>
              </div>
              <div className="space-y-5">
                {[
                  ["Completed", "72%", "bg-success"],
                  ["In progress", "54%", "bg-primary"],
                  ["Blocked", "12%", "bg-destructive"],
                ].map(([label, value, color]) => (
                  <div key={label}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span>{label}</span>
                      <span className="text-muted-foreground">{value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary">
                      <div className={`h-full rounded-full ${color}`} style={{ width: value }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
