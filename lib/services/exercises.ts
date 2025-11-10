// Exercises API service
import { api } from '../apiClient';
import { Exercise, CreateExerciseDto, UpdateExerciseDto } from '../types';

export const exercisesService = {
  // Get all exercises for trainer
  getAll: (token: string) =>
    api.get<Exercise[]>('/api/Exercises', token),

  // Get unassigned exercises
  getUnassigned: (token: string) =>
    api.get<Exercise[]>('/api/Exercises/unassigned', token),

  // Get exercise by ID
  getById: (id: number, token: string) =>
    api.get<Exercise>(`/api/Exercises/${id}`, token),

  // Create standalone exercise
  create: (exercise: CreateExerciseDto, token: string) =>
    api.post<Exercise>('/api/Exercises', exercise, token),

  // Add exercise to program
  addToProgram: (programId: number, exercise: CreateExerciseDto, token: string) =>
    api.post<Exercise>(`/api/Exercises/Program/${programId}`, exercise, token),

  // Update exercise
  update: (id: number, exercise: UpdateExerciseDto, token: string) =>
    api.put<void>(`/api/Exercises/${id}`, exercise, token),

  // Delete exercise
  delete: (id: number, token: string) =>
    api.delete<void>(`/api/Exercises/${id}`, token),
};

