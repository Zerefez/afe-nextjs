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
    const users = await apiClient.get<any[]>('/api/Users', tokenData.jwt);
    const currentUser = users.find((u: any) => u.email === email);

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Set session cookie
    await setSession({
      user: currentUser,
      token: tokenData.jwt,
    });

    return NextResponse.json({
      success: true,
      user: currentUser,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 401 }
    );
  }
}

