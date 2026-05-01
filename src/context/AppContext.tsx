import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { users as seedUsers, projects as seedProjects, tasks as seedTasks, activities as seedActivities, notifications as seedNotifications } from "@/lib/mockData";
import type { User, Project, Task, Activity, Notification, Role } from "@/lib/types";

interface AppContextValue {
  currentUser: User | null;
  users: User[];
  projects: Project[];
  tasks: Task[];
  activities: Activity[];
  notifications: Notification[];
  isAdmin: boolean;
  login: (email: string) => boolean;
  logout: () => void;
  switchRole: (role: Role) => void;
  addProject: (p: Omit<Project, "id" | "createdAt">) => void;
  updateProject: (id: string, p: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addTask: (t: Omit<Task, "id" | "createdAt" | "comments">) => void;
  updateTask: (id: string, t: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addComment: (taskId: string, content: string) => void;
  inviteMember: (u: Omit<User, "id" | "avatar">) => void;
  removeMember: (id: string) => void;
  markNotificationRead: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(seedUsers);
  const [projects, setProjects] = useState<Project[]>(seedProjects);
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [activities, setActivities] = useState<Activity[]>(seedActivities);
  const [notifications, setNotifications] = useState<Notification[]>(seedNotifications);

  useEffect(() => {
    const stored = localStorage.getItem("nova_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      const fresh = seedUsers.find(u => u.id === parsed.id);
      setCurrentUser(fresh ? { ...fresh, role: parsed.role } : parsed);
    }
  }, []);

  const login = (email: string) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase()) || users[0];
    setCurrentUser(user);
    localStorage.setItem("nova_user", JSON.stringify(user));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("nova_user");
  };

  const switchRole = (role: Role) => {
    if (!currentUser) return;
    const updated = { ...currentUser, role };
    setCurrentUser(updated);
    localStorage.setItem("nova_user", JSON.stringify(updated));
  };

  const addActivity = (action: string, target: string, projectId?: string) => {
    if (!currentUser) return;
    setActivities(prev => [{ id: `a${Date.now()}`, userId: currentUser.id, action, target, projectId, createdAt: new Date().toISOString() }, ...prev]);
  };

  const addProject: AppContextValue["addProject"] = (p) => {
    const np: Project = { ...p, id: `p${Date.now()}`, createdAt: new Date().toISOString() };
    setProjects(prev => [np, ...prev]);
    addActivity("created project", np.name, np.id);
  };
  const updateProject: AppContextValue["updateProject"] = (id, p) => setProjects(prev => prev.map(x => x.id === id ? { ...x, ...p } : x));
  const deleteProject: AppContextValue["deleteProject"] = (id) => {
    setProjects(prev => prev.filter(x => x.id !== id));
    setTasks(prev => prev.filter(t => t.projectId !== id));
  };

  const addTask: AppContextValue["addTask"] = (t) => {
    const nt: Task = { ...t, id: `t${Date.now()}`, createdAt: new Date().toISOString(), comments: [] };
    setTasks(prev => [nt, ...prev]);
    addActivity("created task", nt.title, nt.projectId);
  };
  const updateTask: AppContextValue["updateTask"] = (id, t) => {
    setTasks(prev => prev.map(x => x.id === id ? { ...x, ...t } : x));
  };
  const deleteTask: AppContextValue["deleteTask"] = (id) => setTasks(prev => prev.filter(x => x.id !== id));

  const addComment: AppContextValue["addComment"] = (taskId, content) => {
    if (!currentUser) return;
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, comments: [...t.comments, { id: `c${Date.now()}`, taskId, authorId: currentUser.id, content, createdAt: new Date().toISOString() }] } : t));
  };

  const inviteMember: AppContextValue["inviteMember"] = (u) => {
    const nu: User = { ...u, id: `u${Date.now()}`, avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(u.name)}` };
    setUsers(prev => [...prev, nu]);
    addActivity("invited", `${nu.name} to the team`);
  };
  const removeMember: AppContextValue["removeMember"] = (id) => setUsers(prev => prev.filter(u => u.id !== id));

  const markNotificationRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const value = useMemo<AppContextValue>(() => ({
    currentUser, users, projects, tasks, activities, notifications,
    isAdmin: currentUser?.role === "admin",
    login, logout, switchRole,
    addProject, updateProject, deleteProject,
    addTask, updateTask, deleteTask, addComment,
    inviteMember, removeMember, markNotificationRead,
  }), [currentUser, users, projects, tasks, activities, notifications]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
