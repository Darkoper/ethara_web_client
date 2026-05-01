import { Blocks } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrandLogo({ className, iconClassName }: { className?: string; iconClassName?: string }) {
  return (
    <div className={cn("grid place-items-center rounded-xl bg-aurora shadow-glow", className)}>
      <Blocks className={cn("text-white", iconClassName)} />
    </div>
  );
}
