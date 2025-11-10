// API client helper for authenticated requests

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://assignment2.swafe.dk';

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

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    // Handle non-JSON responses
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

export const api = {
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

