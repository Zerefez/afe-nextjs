/**
 * Exercise Service
 * Handles all exercise-related API operations
 */

import { apiClient } from '../lib/api-client';
import { CreateExerciseDto, Exercise, UpdateExerciseDto } from '../types';

export const exerciseService = {
  getAll: (token: string) =>
    apiClient.get<Exercise[]>('/api/Exercises', token),

  getById: (id: number, token: string) =>
    apiClient.get<Exercise>(`/api/Exercises/${id}`, token),

  create: (exercise: CreateExerciseDto, token: string) =>
    apiClient.post<Exercise>('/api/Exercises', exercise, token),

  addToProgram: (programId: number, exercise: CreateExerciseDto, token: string) =>
    apiClient.post<Exercise>(`/api/WorkoutPrograms/${programId}/Exercises`, exercise, token),

  update: (id: number, exercise: UpdateExerciseDto, token: string) =>
    apiClient.put<void>(`/api/Exercises/${id}`, exercise, token),

  delete: (id: number, token: string) =>
    apiClient.delete<void>(`/api/Exercises/${id}`, token),
};

