import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  wrapperClassName?: string;
};

export function Input({
  id,
  label,
  hint,
  error,
  leading,
  trailing,
  className,
  wrapperClassName,
  ...props
}: InputProps) {
  const inputId = id ?? props.name;
  return (
    <div className={cn("ui-field", wrapperClassName)}>
      {label && <label className="ui-label" htmlFor={inputId}>{label}</label>}
      <div className={cn("ui-input-wrap", error && "is-invalid")}>
        {leading && <span className="ui-input-addon">{leading}</span>}
        <input id={inputId} className={cn("ui-input", className)} aria-invalid={!!error} aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined} {...props} />
        {trailing && <span className="ui-input-addon">{trailing}</span>}
      </div>
      {error ? <p className="ui-field-error" id={`${inputId}-error`}>{error}</p> : hint ? <p className="ui-field-hint" id={`${inputId}-hint`}>{hint}</p> : null}
    </div>
  );
}
