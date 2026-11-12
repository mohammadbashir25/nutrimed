import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  size?: "wide" | "default" | "narrow";
};

export function Container({
  children,
  className,
  size = "default",
  ...props
}: ContainerProps) {
  return (
    <div className={cn("ui-container", `ui-container--${size}`, className)} {...props}>
      {children}
    </div>
  );
}
