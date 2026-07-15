import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import { useId } from 'react';

import { classNames } from '../../lib/class-names';

type FieldBaseProps = {
  error?: string | undefined;
  hint?: string | undefined;
  id?: string | undefined;
  label: string;
};

function FieldShell({
  children,
  error,
  hint,
  id,
  label,
}: FieldBaseProps & {
  children: (fieldId: string, describedBy: string | undefined) => ReactNode;
}) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="wm-field">
      <label className="wm-field-label" htmlFor={fieldId}>
        {label}
      </label>
      {children(fieldId, describedBy)}
      {hint ? (
        <p className="wm-field-message" id={hintId}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="wm-field-message wm-field-error" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export type InputProps = FieldBaseProps & InputHTMLAttributes<HTMLInputElement>;

export function Input({ error, hint, id, label, className, ...props }: InputProps) {
  return (
    <FieldShell error={error} hint={hint} id={id} label={label}>
      {(fieldId, descriptionId) => (
        <input
          aria-describedby={descriptionId}
          aria-invalid={error ? true : undefined}
          className={classNames('wm-input', className)}
          id={fieldId}
          {...props}
        />
      )}
    </FieldShell>
  );
}

export type SelectProps = FieldBaseProps & SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ children, error, hint, id, label, className, ...props }: SelectProps) {
  return (
    <FieldShell error={error} hint={hint} id={id} label={label}>
      {(fieldId, descriptionId) => (
        <select
          aria-describedby={descriptionId}
          aria-invalid={error ? true : undefined}
          className={classNames('wm-input', className)}
          id={fieldId}
          {...props}
        >
          {children}
        </select>
      )}
    </FieldShell>
  );
}

export type TextareaProps = FieldBaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ error, hint, id, label, className, ...props }: TextareaProps) {
  return (
    <FieldShell error={error} hint={hint} id={id} label={label}>
      {(fieldId, descriptionId) => (
        <textarea
          aria-describedby={descriptionId}
          aria-invalid={error ? true : undefined}
          className={classNames('wm-input wm-textarea', className)}
          id={fieldId}
          {...props}
        />
      )}
    </FieldShell>
  );
}
