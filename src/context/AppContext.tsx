import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { apiRequest, clearToken, getToken, setToken } from "@/lib/api";
import type { User, Project, Task, Activity, Notification, Role } from "@/lib/types";

interface BootstrapPayload {
  currentUser: User;
  users: User[];
  projects: Project[];
  tasks: Task[];
  activities: Activity[];
  notifications: Notification[];
}

interface AppContextValue {
  currentUser: User | null;
  users: User[];
  projects: Project[];
  tasks: Task[];
  activities: Activity[];
  notifications: Notification[];
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (input: { name: string; email: string; password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  switchRole: (role: Role, userId?: string) => Promise<void>;
  addProject: (p: Omit<Project, "id" | "createdAt">) => Promise<void>;
  updateProject: (id: string, p: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addTask: (t: Omit<Task, "id" | "createdAt" | "comments">) => Promise<void>;
  updateTask: (id: string, t: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addComment: (taskId: string, content: string) => Promise<void>;
  inviteMember: (u: Omit<User, "id" | "avatar">) => Promise<void>;
  removeMember: (id: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const applyBootstrap = (data: BootstrapPayload) => {
    setCurrentUser(data.currentUser);
    setUsers(data.users);
    setProjects(data.projects);
    setTasks(data.tasks);
    setActivities(data.activities);
    setNotifications(data.notifications);
  };

  const refreshWorkspace = async () => {
    const data = await apiRequest<BootstrapPayload>("/bootstrap");
    applyBootstrap(data);
  };

  useEffect(() => {
    const hydrate = async () => {
      if (!getToken()) {
        setIsLoading(false);
        return;
      }

      try {
        await refreshWorkspace();
      } catch {
        clearToken();
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    hydrate();
  }, []);

  const login: AppContextValue["login"] = async (email, password) => {
    const data = await apiRequest<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    await refreshWorkspace();
    return true;
  };

  const signup: AppContextValue["signup"] = async (input) => {
    const data = await apiRequest<{ token: string; user: User }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(input),
    });
    setToken(data.token);
    await refreshWorkspace();
    return true;
  };

  const logout = async () => {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
    } finally {
      clearToken();
      setCurrentUser(null);
      setUsers([]);
      setProjects([]);
      setTasks([]);
      setActivities([]);
      setNotifications([]);
    }
  };

  const switchRole: AppContextValue["switchRole"] = async (role, userId) => {
    const targetId = userId || currentUser?.id;
    if (!targetId) return;
    const updated = await apiRequest<User>(`/users/${targetId}`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
    setUsers(prev => prev.map(user => user.id === updated.id ? updated : user));
    if (currentUser?.id === updated.id) setCurrentUser(updated);
  };

  const addProject: AppContextValue["addProject"] = async (p) => {
    const project = await apiRequest<Project>("/projects", { method: "POST", body: JSON.stringify(p) });
    setProjects(prev => [project, ...prev]);
    await refreshWorkspace();
  };

  const updateProject: AppContextValue["updateProject"] = async (id, p) => {
    const project = await apiRequest<Project>(`/projects/${id}`, { method: "PATCH", body: JSON.stringify(p) });
    setProjects(prev => prev.map(item => item.id === id ? project : item));
  };

  const deleteProject: AppContextValue["deleteProject"] = async (id) => {
    await apiRequest(`/projects/${id}`, { method: "DELETE" });
    setProjects(prev => prev.filter(item => item.id !== id));
    setTasks(prev => prev.filter(task => task.projectId !== id));
  };

  const addTask: AppContextValue["addTask"] = async (t) => {
    const task = await apiRequest<Task>("/tasks", { method: "POST", body: JSON.stringify(t) });
    setTasks(prev => [task, ...prev]);
    await refreshWorkspace();
  };

  const updateTask: AppContextValue["updateTask"] = async (id, t) => {
    const previous = tasks;
    setTasks(prev => prev.map(item => item.id === id ? { ...item, ...t } : item));
    try {
      const task = await apiRequest<Task>(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(t) });
      setTasks(prev => prev.map(item => item.id === id ? task : item));
    } catch (error) {
      setTasks(previous);
      throw error;
    }
  };

  const deleteTask: AppContextValue["deleteTask"] = async (id) => {
    await apiRequest(`/tasks/${id}`, { method: "DELETE" });
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const addComment: AppContextValue["addComment"] = async (taskId, content) => {
    const task = await apiRequest<Task>(`/tasks/${taskId}/comments`, {
      method: "POST",
      body: JSON.stringify({ content }),
    });
    setTasks(prev => prev.map(item => item.id === taskId ? task : item));
    await refreshWorkspace();
  };

  const inviteMember: AppContextValue["inviteMember"] = async (u) => {
    const user = await apiRequest<User>("/users", { method: "POST", body: JSON.stringify(u) });
    setUsers(prev => [...prev, user]);
    await refreshWorkspace();
  };

  const removeMember: AppContextValue["removeMember"] = async (id) => {
    await apiRequest(`/users/${id}`, { method: "DELETE" });
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const markNotificationRead = async (id: string) => {
    const notification = await apiRequest<Notification>(`/notifications/${id}/read`, { method: "PATCH" });
    setNotifications(prev => prev.map(item => item.id === id ? notification : item));
  };

  const value = useMemo<AppContextValue>(() => ({
    currentUser, users, projects, tasks, activities, notifications,
    isAdmin: currentUser?.role === "admin",
    isLoading,
    login, signup, logout, switchRole,
    addProject, updateProject, deleteProject,
    addTask, updateTask, deleteTask, addComment,
    inviteMember, removeMember, markNotificationRead,
  }), [currentUser, users, projects, tasks, activities, notifications, isLoading]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
