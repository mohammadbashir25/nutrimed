import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

type PageHeaderProps = {
  title: string;
  description?: string;
  breadcrumb?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({
  title,
  description,
  breadcrumb,
  actions,
  className
}: PageHeaderProps) {
  return (
    <header className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="min-w-0">
        {breadcrumb && <div className="mb-2 text-xs font-bold text-[#8a99a9]">{breadcrumb}</div>}
        <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-[#062f5e]">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-[#66778a]">{description}</p>}
      </div>
      {actions && <div className="ui-page-header__actions">{actions}</div>}
    </header>
  );
}
