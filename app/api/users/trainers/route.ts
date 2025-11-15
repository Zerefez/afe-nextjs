import { NextResponse } from 'next/server';
import { getToken } from '@/shared/lib/auth';
import { userService } from '@/shared/services';

export async function GET() {
  try {
    const token = await getToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const users = await userService.getAll(token);
    const trainers = users.filter(u => u.accountType === 'PersonalTrainer');

    return NextResponse.json(trainers);
  } catch (error: any) {
    console.error('Fetch trainers error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch trainers' },
      { status: 500 }
    );
  }
}

