/**
 * Trainer dashboard data fetching
 */

import { redirect } from 'next/navigation';
import { ApiError } from '@/shared/lib/api-client';
import { userService, programService } from '@/shared/services';

export async function getTrainerDashboardData(token: string) {
  try {
    const [clients, programs] = await Promise.all([
      userService.getClients(token),
      programService.getByTrainer(token),
    ]);

    return { clients, programs };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      redirect('/logout');
    }
    throw error;
  }
}

