import { cn } from "@/lib/utils";

export function BrandLogo({ className, iconClassName }: { className?: string; iconClassName?: string }) {
  return (
    <div className={cn("grid place-items-center rounded-xl bg-primary shadow-glow", className)}>
      <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("h-5 w-5 text-white", iconClassName)}>
        <path d="M8 7.5C8 6.67 8.67 6 9.5 6H24V9.5H11.5V14H22.5V17.5H11.5V22.5H24V26H9.5C8.67 26 8 25.33 8 24.5V7.5Z" fill="currentColor" />
        <path d="M14 14H25V17.5H14V14Z" fill="#FDA4AF" />
      </svg>
    </div>
  );
}
