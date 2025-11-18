"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from './button';

interface NavbarProps {
  user: {
    firstName?: string;
    lastName?: string;
    accountType: string;
  };
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getDashboardLink = () => {
    const accountType = user.accountType?.toLowerCase();
    if (accountType === 'manager') return '/manager/dashboard';
    if (accountType === 'personaltrainer') return '/trainer/dashboard';
    if (accountType === 'client') return '/client/dashboard';
    return '/';
  };

  return (
    <nav className="bg-[var(--color-surface)] border-b border-[var(--color-border)] backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-[4.5rem]">
          <div className="flex items-center">
            <Link 
              href={getDashboardLink()} 
              className="text-[19px] font-semibold text-[var(--color-text-primary)] tracking-tight hover:opacity-60 transition-opacity duration-200"
            >
              Fitness
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            <div className="flex flex-col items-end">
              <span className="text-[14px] font-medium text-[var(--color-text-primary)]">
                {user.firstName || ''} {user.lastName || ''}
              </span>
              <span className="text-[11px] text-[var(--color-text-tertiary)] uppercase tracking-wider font-medium">
                {user.accountType}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

