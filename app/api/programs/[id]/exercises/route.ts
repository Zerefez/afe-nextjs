import { NextRequest, NextResponse } from 'next/server';
import { getToken } from '@/shared/lib/auth';
import { exerciseService } from '@/shared/services';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken();
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id } = await params;
    const programId = parseInt(id);

    const exercise = await exerciseService.addToProgram(programId, body, token);

    return NextResponse.json(exercise);
  } catch (error: any) {
    console.error('Add exercise error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add exercise' },
      { status: 400 }
    );
  }
}

