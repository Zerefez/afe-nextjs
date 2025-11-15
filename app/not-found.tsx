import { Button, Card, CardContent } from '@/shared/ui';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
      <Card className="max-w-md">
        <CardContent>
          <div className="text-center">
            <h2 className="text-[72px] font-semibold text-black dark:text-white mb-2 tracking-tight leading-none">
              404
            </h2>
            <h3 className="text-[22px] font-semibold text-black dark:text-white mb-3 tracking-tight">
              Page Not Found
            </h3>
            <p className="text-gray-500 dark:text-gray-500 mb-8 text-[15px]">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <Link href="/">
              <Button>Return Home</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

