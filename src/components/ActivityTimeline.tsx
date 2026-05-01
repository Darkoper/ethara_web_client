import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { Activity } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

export function ActivityTimeline({ activities, limit }: { activities: Activity[]; limit?: number }) {
  const { users } = useApp();
  const items = limit ? activities.slice(0, limit) : activities;
  return (
    <div className="space-y-3">
      {items.map((a, i) => {
        const user = users.find(u => u.id === a.userId);
        return (
          <motion.div key={a.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="flex gap-3">
            <div className="relative">
              <img src={user?.avatar} alt="" className="h-8 w-8 rounded-full bg-secondary ring-2 ring-background" />
              {i < items.length - 1 && <div className="absolute left-1/2 top-9 h-full w-px -translate-x-1/2 bg-border" />}
            </div>
            <div className="flex-1 pb-3">
              <p className="text-sm">
                <span className="font-medium">{user?.name}</span>{" "}
                <span className="text-muted-foreground">{a.action}</span>{" "}
                <span className="font-medium">{a.target}</span>
              </p>
              <p className="text-[11px] text-muted-foreground">{formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
