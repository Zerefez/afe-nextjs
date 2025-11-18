import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  children, 
  ...props 
}: ButtonProps) {
  const baseStyles = 'font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-[var(--color-button-primary-bg)] text-[var(--color-button-primary-text)] hover:bg-[var(--color-button-primary-hover)] focus:ring-[var(--color-focus)] rounded-[var(--radius-md)]',
    secondary: 'bg-[var(--color-button-secondary-bg)] text-[var(--color-button-secondary-text)] border border-[var(--color-border)] hover:bg-[var(--color-button-secondary-hover)] focus:ring-[var(--color-focus)] rounded-[var(--radius-md)]',
    danger: 'bg-[var(--color-button-primary-bg)] text-[var(--color-button-primary-text)] hover:bg-[var(--color-button-primary-hover)] focus:ring-[var(--color-focus)] rounded-[var(--radius-md)]',
    ghost: 'bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-button-ghost-hover)] focus:ring-[var(--color-focus)] rounded-[var(--radius-md)]',
  };
  
  const sizeStyles = {
    sm: 'px-4 py-2 text-[13px]',
    md: 'px-6 py-3 text-[15px]',
    lg: 'px-8 py-4 text-[17px]',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

