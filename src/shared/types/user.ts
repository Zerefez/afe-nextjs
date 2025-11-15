/**
 * User domain types
 */

export interface UserDto {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  accountType: 'Manager' | 'PersonalTrainer' | 'Client';
  personalTrainerId?: number | null;
}

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  accountType: 'Manager' | 'PersonalTrainer' | 'Client';
  personalTrainerId?: number | null;
}

export interface NewPasswordDto {
  oldPassword: string;
  newPassword: string;
}

