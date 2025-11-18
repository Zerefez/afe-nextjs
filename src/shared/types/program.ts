/**
 * Workout program domain types
 */

export interface Exercise {
  exerciseId: number;
  name: string;
  description?: string;
  sets?: number;
  repetitions?: number;
  time?: string;
  workoutProgramId?: number;
  personalTrainerId?: number | null;
}

export interface WorkoutProgram {
  workoutProgramId: number;
  name: string;
  description?: string;
  clientId?: number;
  exercises?: Exercise[];
}

export interface CreateWorkoutDto {
  name: string;
  description?: string;
  clientId?: number;
}

export interface UpdateWorkoutDto {
  name?: string;
  description?: string;
  clientId?: number;
}

export interface CreateExerciseDto {
  name: string;
  description?: string;
  sets?: number;
  repetitions?: number;
  time?: string;
}

export interface UpdateExerciseDto {
  name?: string;
  description?: string;
  sets?: number;
  repetitions?: number;
  time?: string;
}

