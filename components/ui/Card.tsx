import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  padding?: "none" | "sm" | "md" | "lg";
  interactive?: boolean;
};

export function Card({
  children,
  className,
  padding = "md",
  interactive = false,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "ui-card",
        `ui-card--${padding}`,
        interactive && "ui-card--interactive",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
