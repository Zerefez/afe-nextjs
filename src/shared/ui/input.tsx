import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-[13px] font-medium text-[var(--color-text-secondary)] mb-2.5">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] transition-all duration-200 bg-[var(--color-input-bg)] text-[var(--color-text-primary)] placeholder:text-[var(--color-input-placeholder)] text-[15px] ${
          error ? 'border-[var(--color-focus)]' : 'border-[var(--color-input-border)] focus:border-[var(--color-input-focus-border)]'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-2 text-[13px] text-[var(--color-text-secondary)]">{error}</p>
      )}
    </div>
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function TextArea({ label, error, className = '', ...props }: TextAreaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-[13px] font-medium text-[var(--color-text-secondary)] mb-2.5">
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-4 py-3 border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] transition-all duration-200 bg-[var(--color-input-bg)] text-[var(--color-text-primary)] placeholder:text-[var(--color-input-placeholder)] text-[15px] ${
          error ? 'border-[var(--color-focus)]' : 'border-[var(--color-input-border)] focus:border-[var(--color-input-focus-border)]'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-2 text-[13px] text-[var(--color-text-secondary)]">{error}</p>
      )}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export function Select({ label, error, className = '', children, ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-[13px] font-medium text-[var(--color-text-secondary)] mb-2.5">
          {label}
        </label>
      )}
      <select
        className={`w-full px-4 py-3 border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] transition-all duration-200 bg-[var(--color-input-bg)] text-[var(--color-text-primary)] text-[15px] ${
          error ? 'border-[var(--color-focus)]' : 'border-[var(--color-input-border)] focus:border-[var(--color-input-focus-border)]'
        } ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="mt-2 text-[13px] text-[var(--color-text-secondary)]">{error}</p>
      )}
    </div>
  );
}

