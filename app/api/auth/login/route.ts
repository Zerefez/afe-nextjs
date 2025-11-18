import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/shared/services';
import { setSession } from '@/shared/lib/auth';
import { apiClient } from '@/shared/lib/api-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Login and get JWT token
    const tokenData = await userService.login({ email, password });

    if (!tokenData.jwt) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Get user details using the token
    interface ApiUser {
      email: string;
      userId: number;
      accountType: string;
      firstName?: string;
      lastName?: string;
      personalTrainerId?: number;
    }
    const users = await apiClient.get<ApiUser[]>('/api/Users', tokenData.jwt);
    const apiUser = users.find((u) => u.email === email);

    if (!apiUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Map API user to our User type with proper type casting
    const currentUser = {
      userId: apiUser.userId,
      email: apiUser.email,
      firstName: apiUser.firstName,
      lastName: apiUser.lastName,
      accountType: apiUser.accountType as 'Manager' | 'PersonalTrainer' | 'Client',
      personalTrainerId: apiUser.personalTrainerId,
    };

    // Set session cookie
    await setSession({
      user: currentUser,
      token: tokenData.jwt,
    });

    return NextResponse.json({
      success: true,
      user: currentUser,
    });
  } catch (error) {
    console.error('Login error:', error);
    const message = error instanceof Error ? error.message : 'Login failed';
    return NextResponse.json(
      { error: message },
      { status: 401 }
    );
  }
}

