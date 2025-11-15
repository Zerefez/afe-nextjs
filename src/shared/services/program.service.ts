/**
 * Program Service
 * Handles all workout program-related API operations
 */

import { apiClient } from '../lib/api-client';
import { WorkoutProgram, CreateWorkoutDto, UpdateWorkoutDto } from '../types';

export const programService = {
  getAll: (token: string) =>
    apiClient.get<WorkoutProgram[]>('/api/WorkoutPrograms', token),

  getByTrainer: (token: string) =>
    apiClient.get<WorkoutProgram[]>('/api/WorkoutPrograms/trainer', token),

  getByClient: (clientId: number, token: string) =>
    apiClient.get<WorkoutProgram[]>(`/api/WorkoutPrograms/client/${clientId}`, token),

  getById: (id: number, token: string) =>
    apiClient.get<WorkoutProgram>(`/api/WorkoutPrograms/${id}`, token),

  create: (program: CreateWorkoutDto, token: string) =>
    apiClient.post<WorkoutProgram>('/api/WorkoutPrograms', program, token),

  update: (id: number, program: UpdateWorkoutDto, token: string) =>
    apiClient.put<void>(`/api/WorkoutPrograms/${id}`, program, token),

  delete: (id: number, token: string) =>
    apiClient.delete<void>(`/api/WorkoutPrograms/${id}`, token),
};

