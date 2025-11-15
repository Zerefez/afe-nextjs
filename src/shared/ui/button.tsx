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
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white disabled:opacity-40 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200',
    secondary: 'bg-white text-black border border-gray-200 hover:bg-gray-50 dark:bg-black dark:text-white dark:border-gray-800 dark:hover:bg-gray-900',
    danger: 'bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200',
    ghost: 'bg-transparent text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-900',
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-[15px]',
    lg: 'px-7 py-3.5 text-[17px]',
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

