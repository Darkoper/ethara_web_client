import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Search, FolderPlus } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectModal } from "@/components/ProjectModal";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProjectStatus } from "@/lib/types";

export default function Projects() {
  const { projects, tasks, isAdmin, currentUser } = useApp();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ProjectStatus | "all">("all");

  const visible = useMemo(() => {
    let list = isAdmin ? projects : projects.filter(p => p.memberIds.includes(currentUser!.id));
    if (filter !== "all") list = list.filter(p => p.status === filter);
    if (query) list = list.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase()));
    return list;
  }, [projects, filter, query, isAdmin, currentUser]);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Projects</h1>
          <p className="mt-1 text-muted-foreground">{visible.length} {visible.length === 1 ? "project" : "projects"}</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setOpen(true)} className="bg-aurora text-white border-0 hover:opacity-90 shadow-glow rounded-xl">
            <Plus className="h-4 w-4 mr-1.5" /> New project
          </Button>
        )}
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search projects…" className="pl-9 bg-secondary/40" />
        </div>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
          <TabsList className="bg-secondary/40">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="planning">Planning</TabsTrigger>
            <TabsTrigger value="on_hold">On Hold</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {visible.length === 0 ? (
        <EmptyState icon={<FolderPlus className="h-7 w-7" />} title="No projects yet" description="Create your first project to start orchestrating work." action={isAdmin && <Button onClick={() => setOpen(true)} className="bg-aurora text-white border-0 hover:opacity-90"><Plus className="h-4 w-4 mr-1.5" />New project</Button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {visible.map((p, i) => <ProjectCard key={p.id} project={p} tasks={tasks} index={i} />)}
        </div>
      )}

      <ProjectModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
