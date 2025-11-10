// TypeScript types based on the backend API swagger schemas

export interface UserDto {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  personalTrainerId?: number | null;
  accountType: string; // "Client" | "PersonalTrainer" | "Manager"
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  personalTrainerId?: number | null;
  accountType: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface TokenDto {
  jwt: string;
}

export interface Exercise {
  exerciseId: number;
  groupId: string;
  name: string | null;
  description: string | null;
  sets: number | null;
  repetitions: number | null;
  time: string | null;
  workoutProgramId: number | null;
  personalTrainerId: number | null;
}

export interface CreateExerciseDto {
  name?: string | null;
  description?: string | null;
  sets?: number | null;
  repetitions?: number | null;
  time?: string | null;
}

export interface UpdateExerciseDto {
  exerciseId: number;
  name?: string | null;
  description?: string | null;
  sets?: number | null;
  repetitions?: number | null;
  time?: string | null;
  workoutProgramId?: number | null;
  personalTrainerId?: number | null;
}

export interface WorkoutProgram {
  workoutProgramId: number;
  groupId: string;
  name: string | null;
  description: string | null;
  exercises: Exercise[] | null;
  personalTrainerId: number;
  clientId: number | null;
}

export interface CreateWorkoutDto {
  name?: string | null;
  description?: string | null;
  exercises?: CreateExerciseDto[] | null;
  clientId?: number | null;
}

export interface UpdateWorkoutDto {
  workoutProgramId: number;
  name?: string | null;
  description?: string | null;
  personalTrainerId: number;
  clientId?: number | null;
}

export interface NewPasswordDto {
  email: string;
  password: string;
  oldPassword: string;
}

export interface CreateGroupDto {
  groupNumber: string;
  prefix: string;
}

// Client-side session/auth types
export interface Session {
  user: UserDto;
  token: string;
}

