import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-[13px] font-medium text-gray-600 dark:text-gray-400 mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all bg-white dark:bg-black text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 ${
          error ? 'border-black dark:border-white' : 'border-gray-200 dark:border-gray-800'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-[13px] text-gray-600 dark:text-gray-400">{error}</p>
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
        <label className="block text-[13px] font-medium text-gray-600 dark:text-gray-400 mb-2">
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all bg-white dark:bg-black text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 ${
          error ? 'border-black dark:border-white' : 'border-gray-200 dark:border-gray-800'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-[13px] text-gray-600 dark:text-gray-400">{error}</p>
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
        <label className="block text-[13px] font-medium text-gray-600 dark:text-gray-400 mb-2">
          {label}
        </label>
      )}
      <select
        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all bg-white dark:bg-black text-black dark:text-white ${
          error ? 'border-black dark:border-white' : 'border-gray-200 dark:border-gray-800'
        } ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="mt-1.5 text-[13px] text-gray-600 dark:text-gray-400">{error}</p>
      )}
    </div>
  );
}

