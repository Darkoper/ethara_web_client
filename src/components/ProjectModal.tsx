import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Project, ProjectStatus, Priority } from "@/lib/types";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

const colors = [
  "from-red-500 to-rose-500",
  "from-rose-600 to-red-500",
  "from-red-700 to-rose-500",
  "from-rose-500 to-red-400",
  "from-pink-500 to-rose-500",
  "from-red-400 to-rose-600",
];

export function ProjectModal({ open, onOpenChange, project }: { open: boolean; onOpenChange: (v: boolean) => void; project?: Project | null }) {
  const { users, currentUser, addProject, updateProject } = useApp();
  const [form, setForm] = useState({
    name: "", description: "", status: "planning" as ProjectStatus, priority: "medium" as Priority,
    dueDate: "", memberIds: [] as string[], color: colors[0],
  });

  useEffect(() => {
    if (project) {
      setForm({
        name: project.name, description: project.description, status: project.status, priority: project.priority,
        dueDate: project.dueDate.slice(0, 10), memberIds: project.memberIds, color: project.color,
      });
    } else {
      setForm({ name: "", description: "", status: "planning", priority: "medium", dueDate: "", memberIds: currentUser ? [currentUser.id] : [], color: colors[Math.floor(Math.random() * colors.length)] });
    }
  }, [project, open, currentUser]);

  const submit = () => {
    if (!form.name.trim() || !form.dueDate) { toast.error("Name and due date are required"); return; }
    const payload = { ...form, dueDate: new Date(form.dueDate).toISOString(), ownerId: currentUser!.id };
    if (project) {
      updateProject(project.id, payload);
      toast.success("Project updated");
    } else {
      addProject(payload);
      toast.success("Project created ✨");
    }
    onOpenChange(false);
  };

  const toggleMember = (id: string) => {
    setForm(f => ({ ...f, memberIds: f.memberIds.includes(id) ? f.memberIds.filter(x => x !== id) : [...f.memberIds, id] }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl glass-strong">
        <DialogHeader><DialogTitle className="font-display text-2xl">{project ? "Edit project" : "New project"}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Name</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Aurora Design System" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Description</label>
            <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What's this project about?" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Status</label>
              <Select value={form.status} onValueChange={(v: ProjectStatus) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Priority</label>
              <Select value={form.priority} onValueChange={(v: Priority) => setForm({ ...form, priority: v })}>
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
              <label className="text-xs text-muted-foreground">Due date</label>
              <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Theme</label>
            <div className="flex flex-wrap gap-2">
              {colors.map(c => (
                <button key={c} type="button" onClick={() => setForm({ ...form, color: c })} className={`h-8 w-8 rounded-lg bg-gradient-to-br ${c} ${form.color === c ? "ring-2 ring-primary-glow ring-offset-2 ring-offset-background" : ""}`} />
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Team members</label>
            <div className="flex flex-wrap gap-2">
              {users.map(u => {
                const active = form.memberIds.includes(u.id);
                return (
                  <button key={u.id} type="button" onClick={() => toggleMember(u.id)} className={`flex items-center gap-2 rounded-full border px-2 py-1 text-xs transition ${active ? "border-primary bg-primary/15 text-primary-glow" : "border-border bg-secondary/40 hover:bg-secondary"}`}>
                    <img src={u.avatar} alt="" className="h-5 w-5 rounded-full bg-background" />{u.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} className="bg-aurora text-white border-0 hover:opacity-90">{project ? "Save changes" : "Create project"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
