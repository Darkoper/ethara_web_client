import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

export function AvatarStack({ ids, size = 28, max = 4, className }: { ids: string[]; size?: number; max?: number; className?: string }) {
  const { users } = useApp();
  const visible = ids.slice(0, max);
  const extra = ids.length - visible.length;
  return (
    <div className={cn("flex -space-x-2", className)}>
      {visible.map(id => {
        const u = users.find(x => x.id === id);
        if (!u) return null;
        return (
          <img
            key={id}
            src={u.avatar}
            alt={u.name}
            title={u.name}
            className="rounded-full ring-2 ring-background bg-secondary object-cover"
            style={{ width: size, height: size }}
          />
        );
      })}
      {extra > 0 && (
        <div
          className="flex items-center justify-center rounded-full bg-secondary text-[10px] font-semibold text-foreground ring-2 ring-background"
          style={{ width: size, height: size }}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}
