export function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 dark:border-gray-800 border-t-black dark:border-t-white"></div>
    </div>
  );
}

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-4 w-4 border',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-2',
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`animate-spin rounded-full border-gray-200 dark:border-gray-800 border-t-black dark:border-t-white ${sizeClasses[size]}`}></div>
    </div>
  );
}

