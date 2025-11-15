/**
 * Authentication types
 */

export interface User {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  accountType: 'Manager' | 'PersonalTrainer' | 'Client';
  personalTrainerId?: number | null;
}

export interface Session {
  user: User;
  token: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface TokenDto {
  jwt: string;
}

