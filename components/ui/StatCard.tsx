import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  detail?: string;
  icon?: ReactNode;
  trend?: { label: string; direction: "up" | "down" | "neutral" };
  className?: string;
};

export function StatCard({
  label,
  value,
  detail,
  icon,
  trend,
  className
}: StatCardProps) {
  return (
    <section className={cn("min-w-0", className)}>
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-bold text-[#66778a]">{label}</span>
        {icon && <span className="grid size-9 place-items-center rounded-xl bg-[#eef5fb] text-[#02488f]">{icon}</span>}
      </div>
      <strong className="mt-4 block text-3xl font-extrabold tracking-[-0.04em] text-[#062f5e]">{value}</strong>
      {(detail || trend) && (
        <div className="ui-stat-card__bottom">
          {trend && <span className={`ui-trend ui-trend--${trend.direction}`}>{trend.label}</span>}
          {detail && <span>{detail}</span>}
        </div>
      )}
    </section>
  );
}
