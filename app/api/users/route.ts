import { NextRequest, NextResponse } from 'next/server';
import { getToken } from '@/shared/lib/auth';
import { userService } from '@/shared/services';

export async function POST(request: NextRequest) {
  try {
    const token = await getToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const user = await userService.create(body, token);

    return NextResponse.json(user);
  } catch (error: any) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 400 }
    );
  }
}

