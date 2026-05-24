import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({ icon: Icon, label, value, change, accent = "primary", index = 0 }: { icon: LucideIcon; label: string; value: string | number; change?: number; accent?: "primary" | "success" | "warning" | "destructive"; index?: number }) {
  const accentMap = {
    primary: "from-red-500/30 to-rose-500/20 text-primary-glow",
    success: "from-rose-500/30 to-red-500/20 text-rose-300",
    warning: "from-red-400/30 to-rose-500/20 text-red-300",
    destructive: "from-red-700/30 to-red-500/20 text-red-300",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl p-5 shadow-elegant"
    >
      <div className={cn("absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br opacity-60 blur-2xl transition-opacity group-hover:opacity-100", accentMap[accent])} />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="mt-1.5 font-display text-4xl">{value}</div>
          {typeof change === "number" && (
            <div className={cn("mt-1.5 inline-flex items-center gap-1 text-xs", change >= 0 ? "text-rose-300" : "text-red-400")}>
              {change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(change)}% vs last week
            </div>
          )}
        </div>
        <div className={cn("grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br", accentMap[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
