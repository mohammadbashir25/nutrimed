import type { TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: string;
  error?: string;
  wrapperClassName?: string;
};

export function Textarea({
  id,
  label,
  hint,
  error,
  className,
  wrapperClassName,
  ...props
}: TextareaProps) {
  const inputId = id ?? props.name;
  return (
    <div className={cn("ui-field", wrapperClassName)}>
      {label && <label className="ui-label" htmlFor={inputId}>{label}</label>}
      <textarea id={inputId} className={cn("ui-textarea", className)} aria-invalid={!!error} {...props} />
      {error ? <p className="ui-field-error">{error}</p> : hint ? <p className="ui-field-hint">{hint}</p> : null}
    </div>
  );
}
