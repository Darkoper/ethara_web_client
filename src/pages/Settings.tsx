import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { RoleBadge } from "@/components/Badges";

export default function Settings() {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();

  if (!currentUser) return null;

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-4xl">Settings</h1>
        <p className="mt-1 text-muted-foreground">Customize your workspace experience.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl p-6">
        <h2 className="font-display text-2xl mb-4">Profile</h2>
        <div className="flex items-center gap-4 mb-5">
          <img src={currentUser.avatar} alt="" className="h-16 w-16 rounded-2xl bg-secondary" />
          <div className="flex-1">
            <div className="font-medium">{currentUser.name}</div>
            <div className="text-sm text-muted-foreground">{currentUser.email}</div>
            <div className="mt-1.5"><RoleBadge role={currentUser.role} /></div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-1.5"><label className="text-xs text-muted-foreground">Name</label><Input defaultValue={currentUser.name} /></div>
          <div className="space-y-1.5"><label className="text-xs text-muted-foreground">Email</label><Input defaultValue={currentUser.email} /></div>
          <div className="space-y-1.5"><label className="text-xs text-muted-foreground">Title</label><Input defaultValue={currentUser.title} /></div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border border-destructive/40 bg-destructive/5 backdrop-blur-xl p-6">
        <h2 className="font-display text-2xl mb-2">Danger zone</h2>
        <p className="text-sm text-muted-foreground mb-4">Sign out of your workspace on this device.</p>
        <Button variant="destructive" onClick={() => { logout(); navigate("/login"); }}><LogOut className="h-4 w-4 mr-1.5" />Sign out</Button>
      </motion.div>
    </div>
  );
}
