import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useApp } from "@/context/AppContext";
import { LayoutDashboard, FolderKanban, ListChecks, Users, Calendar, BarChart3, Settings } from "lucide-react";

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const navigate = useNavigate();
  const { projects, tasks } = useApp();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const go = (path: string) => { navigate(path); onOpenChange(false); };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search projects, tasks, or jump to a page…" />
      <CommandList className="max-h-[420px]">
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          <CommandItem onSelect={() => go("/dashboard")}><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</CommandItem>
          <CommandItem onSelect={() => go("/projects")}><FolderKanban className="mr-2 h-4 w-4" />Projects</CommandItem>
          <CommandItem onSelect={() => go("/tasks")}><ListChecks className="mr-2 h-4 w-4" />Tasks</CommandItem>
          <CommandItem onSelect={() => go("/team")}><Users className="mr-2 h-4 w-4" />Team</CommandItem>
          <CommandItem onSelect={() => go("/calendar")}><Calendar className="mr-2 h-4 w-4" />Calendar</CommandItem>
          <CommandItem onSelect={() => go("/reports")}><BarChart3 className="mr-2 h-4 w-4" />Reports</CommandItem>
          <CommandItem onSelect={() => go("/settings")}><Settings className="mr-2 h-4 w-4" />Settings</CommandItem>
        </CommandGroup>
        <CommandGroup heading="Projects">
          {projects.slice(0, 6).map(p => (
            <CommandItem key={p.id} onSelect={() => go(`/projects/${p.id}`)}>
              <FolderKanban className="mr-2 h-4 w-4" />{p.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Recent tasks">
          {tasks.slice(0, 6).map(t => (
            <CommandItem key={t.id} onSelect={() => go(`/projects/${t.projectId}`)}>
              <ListChecks className="mr-2 h-4 w-4" />{t.title}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
