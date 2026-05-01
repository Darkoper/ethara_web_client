import type { User, Project, Task, Activity, Notification } from "./types";

export const users: User[] = [
  { id: "u1", name: "Aria Vale", email: "aria@nova.io", role: "admin", title: "Founder", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Aria&backgroundColor=b6e3f4" },
  { id: "u2", name: "Kai Mercer", email: "kai@nova.io", role: "member", title: "Product Designer", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Kai&backgroundColor=c0aede" },
  { id: "u3", name: "Lena Park", email: "lena@nova.io", role: "member", title: "Frontend Engineer", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Lena&backgroundColor=ffd5dc" },
  { id: "u4", name: "Theo Knox", email: "theo@nova.io", role: "member", title: "Backend Engineer", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Theo&backgroundColor=ffdfbf" },
  { id: "u5", name: "Nia Rhodes", email: "nia@nova.io", role: "member", title: "QA Lead", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Nia&backgroundColor=d1d4f9" },
  { id: "u6", name: "Owen Cruz", email: "owen@nova.io", role: "admin", title: "Engineering Manager", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Owen&backgroundColor=b6e3f4" },
];

export const projects: Project[] = [
  { id: "p1", name: "Aurora Design System", description: "Unified design tokens, components, and motion language across all surfaces.", status: "active", priority: "high", dueDate: "2026-06-15", memberIds: ["u1","u2","u3"], ownerId: "u1", color: "from-violet-500 to-fuchsia-500", createdAt: "2026-03-01" },
  { id: "p2", name: "Nova Mobile App", description: "Native iOS & Android client with offline-first sync and beautiful UX.", status: "active", priority: "urgent", dueDate: "2026-05-20", memberIds: ["u2","u3","u4","u5"], ownerId: "u6", color: "from-indigo-500 to-violet-500", createdAt: "2026-02-10" },
  { id: "p3", name: "Stellar Analytics", description: "Real-time dashboards with predictive insights powered by ML.", status: "planning", priority: "medium", dueDate: "2026-08-01", memberIds: ["u1","u4","u6"], ownerId: "u1", color: "from-blue-500 to-cyan-500", createdAt: "2026-04-12" },
  { id: "p4", name: "Orbit CRM Integration", description: "Two-way sync with Salesforce, Hubspot, and Pipedrive.", status: "on_hold", priority: "low", dueDate: "2026-07-10", memberIds: ["u4","u5"], ownerId: "u6", color: "from-emerald-500 to-teal-500", createdAt: "2026-01-22" },
  { id: "p5", name: "Quantum Onboarding", description: "Interactive product tour, guided checklists, and milestone rewards.", status: "active", priority: "high", dueDate: "2026-05-30", memberIds: ["u1","u2","u5"], ownerId: "u1", color: "from-pink-500 to-rose-500", createdAt: "2026-03-18" },
  { id: "p6", name: "Helix Billing v2", description: "Usage-based pricing engine with proration and invoicing.", status: "completed", priority: "medium", dueDate: "2026-04-01", memberIds: ["u4","u6"], ownerId: "u6", color: "from-amber-500 to-orange-500", createdAt: "2026-01-05" },
];

const today = new Date();
const dayOffset = (n: number) => new Date(today.getTime() + n * 86400000).toISOString();

export const tasks: Task[] = [
  { id: "t1", projectId: "p1", title: "Define color tokens for dark mode", description: "Audit current palette and propose new semantic tokens.", status: "completed", priority: "high", assigneeId: "u2", dueDate: dayOffset(-3), createdAt: dayOffset(-15), comments: [{ id:"c1", taskId:"t1", authorId:"u1", content:"Looks great, ship it.", createdAt: dayOffset(-2) }] },
  { id: "t2", projectId: "p1", title: "Build Button component variants", status: "in_progress", priority: "medium", assigneeId: "u3", dueDate: dayOffset(2), createdAt: dayOffset(-10), comments: [] },
  { id: "t3", projectId: "p1", title: "Document motion principles", status: "todo", priority: "low", assigneeId: "u2", dueDate: dayOffset(7), createdAt: dayOffset(-5), comments: [] },
  { id: "t4", projectId: "p2", title: "Implement biometric auth", status: "in_review", priority: "urgent", assigneeId: "u4", dueDate: dayOffset(1), createdAt: dayOffset(-12), comments: [] },
  { id: "t5", projectId: "p2", title: "Optimize cold-start performance", status: "in_progress", priority: "high", assigneeId: "u3", dueDate: dayOffset(4), createdAt: dayOffset(-8), comments: [] },
  { id: "t6", projectId: "p2", title: "Polish onboarding flow", status: "todo", priority: "medium", assigneeId: "u2", dueDate: dayOffset(10), createdAt: dayOffset(-3), comments: [] },
  { id: "t7", projectId: "p2", title: "QA regression suite", status: "todo", priority: "high", assigneeId: "u5", dueDate: dayOffset(-1), createdAt: dayOffset(-4), comments: [] },
  { id: "t8", projectId: "p3", title: "Spec data warehouse schema", status: "in_progress", priority: "high", assigneeId: "u4", dueDate: dayOffset(6), createdAt: dayOffset(-6), comments: [] },
  { id: "t9", projectId: "p3", title: "Prototype anomaly detection", status: "todo", priority: "medium", assigneeId: "u1", dueDate: dayOffset(14), createdAt: dayOffset(-2), comments: [] },
  { id: "t10", projectId: "p5", title: "Design checklist component", status: "in_review", priority: "medium", assigneeId: "u2", dueDate: dayOffset(3), createdAt: dayOffset(-7), comments: [] },
  { id: "t11", projectId: "p5", title: "Wire milestone rewards API", status: "todo", priority: "low", assigneeId: "u4", dueDate: dayOffset(9), createdAt: dayOffset(-1), comments: [] },
  { id: "t12", projectId: "p5", title: "Write onboarding copy", status: "completed", priority: "low", assigneeId: "u1", dueDate: dayOffset(-5), createdAt: dayOffset(-20), comments: [] },
  { id: "t13", projectId: "p6", title: "Migrate legacy invoices", status: "completed", priority: "high", assigneeId: "u4", dueDate: dayOffset(-10), createdAt: dayOffset(-30), comments: [] },
  { id: "t14", projectId: "p2", title: "Push notification UX", status: "todo", priority: "medium", assigneeId: "u2", dueDate: dayOffset(-2), createdAt: dayOffset(-3), comments: [] },
];

export const activities: Activity[] = [
  { id: "a1", userId: "u2", action: "completed task", target: "Define color tokens for dark mode", projectId: "p1", createdAt: dayOffset(-1) },
  { id: "a2", userId: "u3", action: "moved to In Progress", target: "Build Button component variants", projectId: "p1", createdAt: dayOffset(0) },
  { id: "a3", userId: "u4", action: "submitted for review", target: "Implement biometric auth", projectId: "p2", createdAt: dayOffset(0) },
  { id: "a4", userId: "u1", action: "created project", target: "Quantum Onboarding", projectId: "p5", createdAt: dayOffset(-2) },
  { id: "a5", userId: "u6", action: "invited", target: "Nia Rhodes to the team", createdAt: dayOffset(-3) },
  { id: "a6", userId: "u5", action: "commented on", target: "QA regression suite", projectId: "p2", createdAt: dayOffset(-1) },
];

export const notifications: Notification[] = [
  { id: "n1", title: "New task assigned", description: "Aria assigned you 'Polish onboarding flow'", read: false, createdAt: dayOffset(0), type: "task" },
  { id: "n2", title: "Mentioned in comment", description: "Kai mentioned you on 'Build Button variants'", read: false, createdAt: dayOffset(-1), type: "mention" },
  { id: "n3", title: "Project deadline approaching", description: "Nova Mobile App is due in 5 days", read: true, createdAt: dayOffset(-2), type: "project" },
];
