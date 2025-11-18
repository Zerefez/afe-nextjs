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
  isEditing: boolean;
  formData: ExerciseFormData;
  loading: boolean;
  onEdit: (exercise: Exercise) => void;
  onDelete: (id: number) => void;
  onSave: (id: number) => void;
  onCancel: () => void;
  onFormChange: (formData: ExerciseFormData) => void;
}

export interface ExerciseFormProps {
  formData: ExerciseFormData;
  loading: boolean;
  title?: string;
  onSave: () => void;
  onCancel: () => void;
  onFormChange: (formData: ExerciseFormData) => void;
}

export interface ExerciseFormData {
  name: string;
  description: string;
  sets: string;
  repetitions: string;
  time: string;
}

