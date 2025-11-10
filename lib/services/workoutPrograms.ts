// Workout Programs API service
import { api } from '../apiClient';
import { WorkoutProgram, CreateWorkoutDto, UpdateWorkoutDto } from '../types';

export const workoutProgramsService = {
  // Get all workout programs for current user
  getAll: (token: string) =>
    api.get<WorkoutProgram[]>('/api/WorkoutPrograms', token),

  // Get programs by trainer
  getByTrainer: (token: string) =>
    api.get<WorkoutProgram[]>('/api/WorkoutPrograms/trainer', token),

  // Get programs by client ID
  getByClient: (clientId: number, token: string) =>
    api.get<WorkoutProgram[]>(`/api/WorkoutPrograms/client/${clientId}`, token),

  // Get program by ID
  getById: (id: number, token: string) =>
    api.get<WorkoutProgram>(`/api/WorkoutPrograms/${id}`, token),

  // Create workout program
  create: (program: CreateWorkoutDto, token: string) =>
    api.post<WorkoutProgram>('/api/WorkoutPrograms', program, token),

  // Update workout program
  update: (id: number, program: UpdateWorkoutDto, token: string) =>
    api.put<void>(`/api/WorkoutPrograms/${id}`, program, token),

  // Delete workout program
  delete: (id: number, token: string) =>
    api.delete<void>(`/api/WorkoutPrograms/${id}`, token),
};

