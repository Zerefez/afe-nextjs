"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from './button';

interface NavbarProps {
  user: {
    firstName: string;
    lastName: string;
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
    <nav className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link 
              href={getDashboardLink()} 
              className="text-[17px] font-semibold text-black dark:text-white tracking-tight hover:opacity-70 transition-opacity"
            >
              Fitness
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex flex-col items-end">
              <span className="text-[13px] font-medium text-black dark:text-white">
                {user.firstName} {user.lastName}
              </span>
              <span className="text-[11px] text-gray-500 dark:text-gray-500 uppercase tracking-wider">
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

