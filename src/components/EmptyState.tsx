import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Sparkles } from "lucide-react";

export function EmptyState({ icon, title, description, action }: { icon?: ReactNode; title: string; description?: string; action?: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/40 p-12 text-center"
    >
      <div className="relative mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-aurora text-white shadow-glow">
        {icon || <Sparkles className="h-7 w-7" />}
      </div>
      <h3 className="font-display text-2xl">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
}
