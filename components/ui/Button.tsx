import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
};

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  leftIcon,
  rightIcon,
  fullWidth = false,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "ui-button",
        `ui-button--${variant}`,
        `ui-button--${size}`,
        fullWidth && "ui-button--full",
        className
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <span className="ui-spinner" aria-hidden="true" /> : leftIcon}
      <span>{children}</span>
      {!loading && rightIcon}
    </button>
  );
}
