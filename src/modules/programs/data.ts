/**
 * Programs module data fetching
 */

import { redirect } from 'next/navigation';
import { ApiError } from '@/shared/lib/api-client';
import { userService, programService } from '@/shared/services';

export async function getProgramsList(token: string) {
  try {
    const [programs, clients] = await Promise.all([
      programService.getByTrainer(token),
      userService.getClients(token),
    ]);

    return { programs, clients };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      redirect('/logout');
    }
    throw error;
  }
}

export async function getProgramDetails(programId: number, token: string) {
  try {
    const [program, clients] = await Promise.all([
      programService.getById(programId, token),
      userService.getClients(token),
    ]);

    const assignedClient = clients.find(c => c.userId === program.clientId);

    return { program, clients, assignedClient };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      redirect('/logout');
    }
    throw error;
  }
}

export async function getClientProgramDetails(programId: number, token: string) {
  try {
    const program = await programService.getById(programId, token);
    return { program };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      redirect('/logout');
    }
    throw error;
  }
}

