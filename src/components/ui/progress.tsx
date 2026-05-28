import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const v = Math.min(100, Math.max(0, value));
  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-card-alt",
        className
      )}
    >
      <div
        className="h-full bg-gradient-to-r from-success to-emerald-400 transition-all"
        style={{ width: `${v}%` }}
      />
    </div>
  );
}
