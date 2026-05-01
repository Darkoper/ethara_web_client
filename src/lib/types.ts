export type Role = "admin" | "member";
export type TaskStatus = "todo" | "in_progress" | "in_review" | "completed";
export type Priority = "low" | "medium" | "high" | "urgent";
export type ProjectStatus = "planning" | "active" | "on_hold" | "completed";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  title?: string;
}

export interface Comment {
  id: string;
  taskId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId?: string;
  dueDate?: string;
  createdAt: string;
  comments: Comment[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: Priority;
  dueDate: string;
  memberIds: string[];
  ownerId: string;
  color: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  userId: string;
  action: string;
  target: string;
  projectId?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  read: boolean;
  createdAt: string;
  type: "task" | "project" | "mention" | "system";
}
