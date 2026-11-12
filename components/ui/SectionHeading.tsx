import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  className
}: SectionHeadingProps) {
  return (
    <div className={cn("ui-section-heading", `ui-section-heading--${align}`, className)}>
      <div>
        {eyebrow && <p className="ui-eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
        {description && <p className="ui-section-heading__description">{description}</p>}
      </div>
      {action && <div className="ui-section-heading__action">{action}</div>}
    </div>
  );
}
