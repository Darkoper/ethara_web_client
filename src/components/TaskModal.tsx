import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Task, TaskStatus, Priority } from "@/lib/types";
import { useApp } from "@/context/AppContext";
import { Trash2, Send } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { ConfirmDialog } from "./ConfirmDialog";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  task?: Task | null;
  defaultProjectId?: string;
  defaultStatus?: TaskStatus;
}

export function TaskModal({ open, onOpenChange, task, defaultProjectId, defaultStatus = "todo" }: Props) {
  const { users, projects, addTask, updateTask, deleteTask, addComment, currentUser, isAdmin } = useApp();
  const [form, setForm] = useState({
    title: "", description: "", status: defaultStatus as TaskStatus, priority: "medium" as Priority,
    assigneeId: "", projectId: defaultProjectId || projects[0]?.id || "", dueDate: "",
  });
  const [comment, setComment] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title, description: task.description || "", status: task.status, priority: task.priority,
        assigneeId: task.assigneeId || "", projectId: task.projectId,
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
      });
    } else {
      setForm({ title: "", description: "", status: defaultStatus, priority: "medium", assigneeId: "", projectId: defaultProjectId || projects[0]?.id || "", dueDate: "" });
    }
  }, [task, open, defaultProjectId, defaultStatus, projects]);

  const canEdit = isAdmin || (task && task.assigneeId === currentUser?.id);

  const submit = () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    const payload = { ...form, dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined, assigneeId: form.assigneeId || undefined };
    if (task) {
      updateTask(task.id, payload);
      toast.success("Task updated");
    } else {
      addTask(payload);
      toast.success("Task created");
    }
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (!task) return;
    deleteTask(task.id);
    toast.success("Task deleted");
    setConfirmDelete(false);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl glass-strong">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">{task ? "Edit task" : "New task"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Title</label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="What needs to be done?" disabled={!isAdmin && !!task} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Description</label>
              <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Add more context…" disabled={!isAdmin && !!task} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">Status</label>
                <Select value={form.status} onValueChange={(v: TaskStatus) => setForm({ ...form, status: v })} disabled={!canEdit}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">Todo</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="in_review">In Review</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">Priority</label>
                <Select value={form.priority} onValueChange={(v: Priority) => setForm({ ...form, priority: v })} disabled={!isAdmin && !!task}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">Assignee</label>
                <Select value={form.assigneeId} onValueChange={(v) => setForm({ ...form, assigneeId: v })} disabled={!isAdmin && !!task}>
                  <SelectTrigger><SelectValue placeholder="Unassigned" /></SelectTrigger>
                  <SelectContent>
                    {users.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">Due date</label>
                <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} disabled={!isAdmin && !!task} />
              </div>
            </div>

            {!task && (
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">Project</label>
                <Select value={form.projectId} onValueChange={(v) => setForm({ ...form, projectId: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}

            {task && (
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Comments ({task.comments.length})</div>
                <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin">
                  {task.comments.map(c => {
                    const author = users.find(u => u.id === c.authorId);
                    return (
                      <div key={c.id} className="flex gap-2.5 rounded-lg bg-secondary/40 p-2.5">
                        <img src={author?.avatar} alt="" className="h-7 w-7 rounded-full bg-secondary" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs font-medium">{author?.name}</span>
                            <span className="text-[10px] text-muted-foreground">{formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}</span>
                          </div>
                          <p className="text-sm">{c.content}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  <Input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write a comment…" onKeyDown={(e) => { if (e.key === "Enter" && comment.trim()) { addComment(task.id, comment); setComment(""); } }} />
                  <Button size="icon" variant="secondary" onClick={() => { if (comment.trim()) { addComment(task.id, comment); setComment(""); } }}><Send className="h-4 w-4" /></Button>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex sm:justify-between gap-2">
            <div>
              {task && isAdmin && (
                <Button variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => setConfirmDelete(true)}>
                  <Trash2 className="h-4 w-4 mr-1.5" />Delete
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button onClick={submit} className="bg-aurora text-white border-0 hover:opacity-90">{task ? "Save changes" : "Create task"}</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={confirmDelete} onOpenChange={setConfirmDelete} title="Delete this task?" description="This action cannot be undone." confirmText="Delete" onConfirm={handleDelete} destructive />
    </>
  );
}
