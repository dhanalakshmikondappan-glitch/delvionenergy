import { useId } from "react";
import type { InputHTMLAttributes } from "react";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  label: string;
  error?: string;
}

/** MASTER.md §50/§113: 14px radius, real-time validation, human-readable errors. */
export function Input({ label, error, className, ...rest }: InputProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-caption font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`w-full rounded-[var(--radius-input)] border bg-surface-elevated px-4 py-3 text-body text-ink transition-colors duration-fast ${
          error ? "border-error" : "border-line focus:border-mercury"
        } ${className ?? ""}`}
        {...rest}
      />
      {error ? (
        <p id={errorId} className="text-caption text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
