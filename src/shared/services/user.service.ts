/**
 * User Service
 * Handles all user-related API operations
 */

import { apiClient } from '../lib/api-client';
import { UserDto, CreateUserDto, NewPasswordDto, LoginDto, TokenDto } from '../types';

export const userService = {
  login: (credentials: LoginDto) =>
    apiClient.post<TokenDto>('/api/Users/login', credentials),

  getAll: (token: string) =>
    apiClient.get<UserDto[]>('/api/Users', token),

  getClients: (token: string) =>
    apiClient.get<UserDto[]>('/api/Users/Clients', token),

  getTrainer: (token: string) =>
    apiClient.get<UserDto>('/api/Users/Trainer', token),

  getById: (id: number, token: string) =>
    apiClient.get<UserDto>(`/api/Users/${id}`, token),

  create: (user: CreateUserDto, token: string) =>
    apiClient.post<UserDto>('/api/Users', user, token),

  update: (id: number, user: Partial<UserDto>, token: string) =>
    apiClient.put<void>(`/api/Users/${id}`, user, token),

  delete: (id: number, token: string) =>
    apiClient.delete<void>(`/api/Users/${id}`, token),

  changePassword: (data: NewPasswordDto, token: string) =>
    apiClient.put<void>('/api/Users/Password', data, token),
};

