import { NextRequest, NextResponse } from 'next/server';
import { getToken } from '@/lib/auth';
import { workoutProgramsService } from '@/lib/services/workoutPrograms';

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
    const program = await workoutProgramsService.create(body, token);

    return NextResponse.json(program);
  } catch (error: any) {
    console.error('Create program error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create program' },
      { status: 400 }
    );
  }
}

