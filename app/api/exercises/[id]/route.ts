import { NextRequest, NextResponse } from 'next/server';
import { getToken } from '@/lib/auth';
import { exercisesService } from '@/lib/services/exercises';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken();
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const exerciseId = parseInt(params.id);

    await exercisesService.update(exerciseId, body, token);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Update exercise error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update exercise' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken();
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const exerciseId = parseInt(params.id);
    await exercisesService.delete(exerciseId, token);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete exercise error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete exercise' },
      { status: 400 }
    );
  }
}

