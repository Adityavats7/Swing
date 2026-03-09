import * as React from 'react';
import { cn } from '@/lib/utils';

export type TextFieldProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size'
> & {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
};

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      id,
      label,
      helperText,
      error,
      className,
      fullWidth = true,
      required,
      disabled,
      ...props
    },
    ref
  ) => {
    // Ensure the input has a stable id for label & aria links
    const inputId = React.useId();
    const finalId = id ?? inputId;

    const describedBy: string[] = [];
    if (helperText) describedBy.push(`${finalId}-help`);
    if (error) describedBy.push(`${finalId}-err`);

    return (
      <div className={cn(fullWidth && 'w-full')}>
        {label ? (
          <label
            htmlFor={finalId}
            className={cn(
              'mb-1.5 block text-sm font-medium',
              disabled ? 'text-gray-400' : 'text-gray-800'
            )}
          >
            {label} {required && <span className="text-red-600">*</span>}
          </label>
        ) : null}

        <input
          id={finalId}
          ref={ref}
          aria-invalid={!!error || undefined}
          aria-describedby={describedBy.length ? describedBy.join(' ') : undefined}
          required={required}
          disabled={disabled}
          className={cn(
            'block w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none transition',
            'placeholder:text-gray-400',
            disabled
              ? 'border-gray-200 text-gray-400 bg-gray-50'
              : error
              ? 'border-red-500 focus:ring-2 focus:ring-red-600'
              : 'border-gray-300 focus:ring-2 focus:ring-blue-600',
            className
          )}
          {...props}
        />

        {helperText && !error && (
          <p id={`${finalId}-help`} className="mt-1 text-xs text-gray-500">
            {helperText}
          </p>
        )}
        {error && (
          <p id={`${finalId}-err`} className="mt-1 text-xs text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

TextField.displayName = 'TextField';
``