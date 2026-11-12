import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type BadgeTone = "blue" | "orange" | "green" | "red" | "gray";
type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
  dot?: boolean;
};

export function Badge({
  children,
  tone = "blue",
  dot = false,
  className,
  ...props
}: BadgeProps) {
  return (
    <span className={cn("ui-badge", `ui-badge--${tone}`, className)} {...props}>
      {dot && <span className="ui-badge__dot" />}
      {children}
    </span>
  );
}
