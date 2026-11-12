import type { SelectHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type SelectOption = { label: string; value: string; disabled?: boolean };
type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  wrapperClassName?: string;
};

export function Select({
  id,
  label,
  hint,
  error,
  options,
  placeholder,
  className,
  wrapperClassName,
  ...props
}: SelectProps) {
  const inputId = id ?? props.name;
  return (
    <div className={cn("ui-field", wrapperClassName)}>
      {label && <label className="ui-label" htmlFor={inputId}>{label}</label>}
      <select id={inputId} className={cn("ui-select", className)} aria-invalid={!!error} {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p className="ui-field-error">{error}</p> : hint ? <p className="ui-field-hint">{hint}</p> : null}
    </div>
  );
}
