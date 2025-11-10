'use client';

import { useEffect } from 'react';
import { Button } from './components/Button';
import { Card, CardContent } from './components/Card';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
      <Card className="max-w-md">
        <CardContent>
          <div className="text-center">
            <h2 className="text-[28px] font-semibold text-black dark:text-white mb-3 tracking-tight">
              Something went wrong
            </h2>
            <p className="text-gray-500 dark:text-gray-500 mb-6 text-[15px]">
              An error occurred while processing your request. Please try again.
            </p>
            {error.message && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
                <p className="text-[13px] text-gray-700 dark:text-gray-300 font-mono break-words">
                  {error.message}
                </p>
              </div>
            )}
            <div className="flex gap-3 justify-center">
              <Button onClick={reset}>Try Again</Button>
              <Button variant="secondary" onClick={() => window.location.href = '/'}>
                Go Home
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

