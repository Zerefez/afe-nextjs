/**
 * API Client
 * Centralized HTTP client for all API requests
 */

import { env } from '../config/env';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions extends RequestInit {
  token?: string;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${env.apiBaseUrl}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new ApiError(
        response.status,
        `API Error: ${response.statusText}`,
        data
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export const apiClient = {
  get: <T>(endpoint: string, token?: string) =>
    apiRequest<T>(endpoint, { method: 'GET', token }),
  
  post: <T>(endpoint: string, body?: any, token?: string) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      token,
    }),
  
  put: <T>(endpoint: string, body?: any, token?: string) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      token,
    }),
  
  delete: <T>(endpoint: string, token?: string) =>
    apiRequest<T>(endpoint, { method: 'DELETE', token }),
};

