import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { PriorityBadge } from "@/components/Badges";
import { cn } from "@/lib/utils";

export default function Calendar() {
  const { tasks, projects, currentUser, isAdmin } = useApp();
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState<Date | null>(new Date());

  const visible = isAdmin ? tasks : tasks.filter(t => t.assigneeId === currentUser?.id);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor));
    const end = endOfWeek(endOfMonth(cursor));
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  const tasksOn = (d: Date) => visible.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), d));
  const dayTasks = selected ? tasksOn(selected) : [];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-4xl">Calendar</h1>
          <p className="mt-1 text-muted-foreground">All your deadlines, one canvas</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl">{format(cursor, "MMMM yyyy")}</h2>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => setCursor(subMonths(cursor, 1))}><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="ghost" size="sm" onClick={() => { setCursor(new Date()); setSelected(new Date()); }}>Today</Button>
              <Button variant="ghost" size="icon" onClick={() => setCursor(addMonths(cursor, 1))}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <div key={d} className="text-center py-1">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((d, i) => {
              const t = tasksOn(d);
              const inMonth = isSameMonth(d, cursor);
              const isToday = isSameDay(d, new Date());
              const isSelected = selected && isSameDay(d, selected);
              return (
                <motion.button key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.005 }} onClick={() => setSelected(d)}
                  className={cn(
                    "aspect-square rounded-xl border p-1.5 text-left transition relative",
                    inMonth ? "border-border/40 bg-secondary/20 hover:bg-secondary/50" : "border-transparent text-muted-foreground/40",
                    isSelected && "border-primary bg-primary/15",
                    isToday && !isSelected && "ring-1 ring-primary-glow"
                  )}>
                  <div className={cn("text-xs", isToday && "font-semibold text-primary-glow")}>{format(d, "d")}</div>
                  {t.length > 0 && (
                    <div className="absolute bottom-1.5 left-1.5 right-1.5 flex flex-wrap gap-0.5">
                      {t.slice(0, 3).map((task, idx) => <div key={idx} className="h-1 flex-1 min-w-[6px] rounded-full bg-aurora" />)}
                      {t.length > 3 && <div className="text-[9px] text-muted-foreground">+{t.length - 3}</div>}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl p-5">
          <h3 className="font-display text-2xl">{selected ? format(selected, "EEEE, MMM d") : "Select a day"}</h3>
          <p className="text-xs text-muted-foreground mb-4">{dayTasks.length} {dayTasks.length === 1 ? "task" : "tasks"} due</p>
          <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin">
            {dayTasks.length ? dayTasks.map(t => {
              const project = projects.find(p => p.id === t.projectId);
              return (
                <div key={t.id} className="rounded-xl border border-border/40 bg-secondary/30 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-sm font-medium">{t.title}</div>
                    <PriorityBadge priority={t.priority} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{project?.name}</div>
                </div>
              );
            }) : <p className="text-sm text-muted-foreground text-center py-8">Nothing scheduled.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
