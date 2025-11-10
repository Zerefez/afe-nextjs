// User API service
import { api } from '../apiClient';
import { UserDto, CreateUserDto, LoginDto, TokenDto, NewPasswordDto } from '../types';

export const usersService = {
  // Login
  login: (credentials: LoginDto) =>
    api.post<TokenDto>('/api/Users/login', credentials),

  // Get all users
  getAll: (token: string) =>
    api.get<UserDto[]>('/api/Users', token),

  // Get clients for a personal trainer
  getClients: (token: string) =>
    api.get<UserDto[]>('/api/Users/Clients', token),

  // Get trainer for logged in user
  getTrainer: (token: string) =>
    api.get<UserDto>('/api/Users/Trainer', token),

  // Get user by ID
  getById: (id: number, token: string) =>
    api.get<UserDto>(`/api/Users/${id}`, token),

  // Create user
  create: (user: CreateUserDto, token: string) =>
    api.post<UserDto>('/api/Users', user, token),

  // Update user
  update: (id: number, user: Partial<UserDto>, token: string) =>
    api.put<void>(`/api/Users/${id}`, user, token),

  // Delete user
  delete: (id: number, token: string) =>
    api.delete<void>(`/api/Users/${id}`, token),

  // Change password
  changePassword: (data: NewPasswordDto, token: string) =>
    api.put<void>('/api/Users/Password', data, token),
};

