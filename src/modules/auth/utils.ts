/**
 * Auth module utilities
 */

import { redirect } from 'next/navigation';
import { getSession, getToken } from '@/shared/lib/auth';

export async function requireAuth() {
  const session = await getSession();
  const token = await getToken();

  if (!session || !token) {
    redirect('/login');
  }

  return { session, token };
}

export function getAccountTypeRoute(accountType: string): string {
  const type = accountType?.toLowerCase();
  if (type === 'manager') return '/manager/dashboard';
  if (type === 'personaltrainer') return '/trainer/dashboard';
  if (type === 'client') return '/client/dashboard';
  return '/';
}

