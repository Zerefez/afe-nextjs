/**
 * Client dashboard data fetching
 */

import { redirect } from 'next/navigation';
import { ApiError } from '@/shared/lib/api-client';
import { userService, programService } from '@/shared/services';

export async function getClientDashboardData(token: string) {
  try {
    const [programs, trainer] = await Promise.all([
      programService.getAll(token),
      userService.getTrainer(token).catch(() => null),
    ]);

    return { programs, trainer };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      redirect('/logout');
    }
    throw error;
  }
}

