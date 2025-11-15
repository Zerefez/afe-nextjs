/**
 * Program component prop types
 */

import { WorkoutProgram, Exercise, UserDto } from './index';

export interface ProgramHeaderProps {
  programId: number;
  initialProgram: WorkoutProgram;
  clients: UserDto[];
  assignedClient?: UserDto;
}

export interface ProgramActionsProps {
  programId: number;
  program: WorkoutProgram;
  clients: UserDto[];
  onUpdate: (updated: WorkoutProgram, client?: UserDto) => void;
}

export interface ExerciseManagerProps {
  programId: number;
  initialExercises: Exercise[];
}

export interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  onDelete: (id: number) => void;
  onEdit: (exercise: Exercise) => void;
}

export interface ExerciseFormProps {
  programId: number;
  onSuccess: (exercise: Exercise) => void;
  editingExercise?: Exercise;
  onCancelEdit?: () => void;
}

export interface ExerciseFormData {
  name: string;
  description: string;
  sets: string;
  repetitions: string;
  time: string;
}

