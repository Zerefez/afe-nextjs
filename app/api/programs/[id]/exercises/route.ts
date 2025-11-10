import { NextRequest, NextResponse } from 'next/server';
import { getToken } from '@/lib/auth';
import { exercisesService } from '@/lib/services/exercises';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken();
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const programId = parseInt(params.id);

    const exercise = await exercisesService.addToProgram(programId, body, token);

    return NextResponse.json(exercise);
  } catch (error: any) {
    console.error('Add exercise error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add exercise' },
      { status: 400 }
    );
  }
}

