import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Mail, MoreVertical, Trash2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RoleBadge } from "@/components/Badges";
import { EmptyState } from "@/components/EmptyState";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import type { Role } from "@/lib/types";

export default function Team() {
  const { users, projects, tasks, isAdmin, inviteMember, removeMember, switchRole } = useApp();
  const [open, setOpen] = useState(false);
  const [removeId, setRemoveId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", role: "member" as Role, title: "" });

  const submit = () => {
    if (!form.name.trim() || !form.email.trim()) { toast.error("Name and email required"); return; }
    inviteMember(form);
    toast.success(`${form.name} invited 🎉`);
    setForm({ name: "", email: "", role: "member", title: "" });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Team</h1>
          <p className="mt-1 text-muted-foreground">{users.length} {users.length === 1 ? "member" : "members"}</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setOpen(true)} className="bg-aurora text-white border-0 hover:opacity-90 shadow-glow rounded-xl">
            <Plus className="h-4 w-4 mr-1.5" /> Invite member
          </Button>
        )}
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((u, i) => {
          const userProjects = projects.filter(p => p.memberIds.includes(u.id)).length;
          const userTasks = tasks.filter(t => t.assigneeId === u.id).length;
          return (
            <motion.div key={u.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} whileHover={{ y: -3 }} className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl p-5 shadow-elegant">
              <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-aurora opacity-20 blur-2xl group-hover:opacity-40 transition" />
              <div className="relative flex items-start gap-4">
                <img src={u.avatar} alt={u.name} className="h-14 w-14 rounded-2xl bg-secondary" />
                <div className="min-w-0 flex-1">
                  <div className="font-display text-xl truncate">{u.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{u.title}</div>
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground"><Mail className="h-3 w-3" />{u.email}</div>
                </div>
                {isAdmin && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="opacity-0 group-hover:opacity-100 transition rounded-lg p-1.5 hover:bg-secondary"><MoreVertical className="h-4 w-4" /></button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass-strong">
                      <DropdownMenuItem onClick={() => switchRole(u.role === "admin" ? "member" : "admin", u.id)}>Toggle role</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => setRemoveId(u.id)}><Trash2 className="h-4 w-4 mr-1.5" />Remove</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              <div className="relative mt-4 flex items-center justify-between">
                <RoleBadge role={u.role} />
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span><span className="text-foreground font-semibold">{userProjects}</span> projects</span>
                  <span><span className="text-foreground font-semibold">{userTasks}</span> tasks</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="glass-strong">
          <DialogHeader><DialogTitle className="font-display text-2xl">Invite a teammate</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input placeholder="Title (optional)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Select value={form.role} onValueChange={(v: Role) => setForm({ ...form, role: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="member">Member</SelectItem><SelectItem value="admin">Admin</SelectItem></SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit} className="bg-aurora text-white border-0 hover:opacity-90">Send invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!removeId} onOpenChange={(v) => !v && setRemoveId(null)} title="Remove this member?" description="They'll lose access to all projects." confirmText="Remove" destructive onConfirm={() => { if (removeId) { removeMember(removeId); toast.success("Member removed"); setRemoveId(null); } }} />
    </div>
  );
}
