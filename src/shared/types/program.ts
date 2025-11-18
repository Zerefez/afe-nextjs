/**
 * Workout program domain types
 */

export interface Exercise {
  exerciseId: number;
  name: string;
  description?: string | null;
  sets?: number;
  repetitions?: number;
  time?: string | null;
  workoutProgramId?: number | null;
  personalTrainerId?: number | null;
}

export interface WorkoutProgram {
  workoutProgramId: number;
  name: string;
  description?: string | null;
  clientId?: number | null;
  personalTrainerId?: number | null;
  exercises?: Exercise[];
}

export interface CreateWorkoutDto {
  name: string;
  description?: string | null;
  clientId?: number | null;
  personalTrainerId?: number | null;
}

export interface UpdateWorkoutDto {
  name?: string;
  description?: string | null;
  clientId?: number | null;
  personalTrainerId?: number | null;
}

export interface CreateExerciseDto {
  name: string;
  description?: string | null;
  sets?: number;
  repetitions?: number;
  time?: string | null;
  workoutProgramId?: number | null;
  personalTrainerId?: number | null;
}

export interface UpdateExerciseDto {
  name?: string;
  description?: string | null;
  sets?: number;
  repetitions?: number;
  time?: string | null;
  workoutProgramId?: number | null;
  personalTrainerId?: number | null;
}

