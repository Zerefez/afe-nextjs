'use client';

import { useEffect } from 'react';
import { Button, Card, CardContent } from '@/shared/ui';

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
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
      <Card className="max-w-md">
        <CardContent>
          <div className="text-center py-6">
            <h2 className="text-[28px] font-semibold text-[var(--color-text-primary)] mb-3 tracking-tight">
              Something went wrong
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-6 text-[15px]">
              An error occurred while processing your request. Please try again.
            </p>
            {error.message && (
              <div className="mb-6 p-4 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-[var(--radius-md)]">
                <p className="text-[13px] text-[var(--color-text-primary)] font-mono wrap-break-word">
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

