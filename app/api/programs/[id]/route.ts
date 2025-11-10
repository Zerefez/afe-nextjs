import { NextRequest, NextResponse } from 'next/server';
import { getToken } from '@/lib/auth';
import { workoutProgramsService } from '@/lib/services/workoutPrograms';

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
    const programId = parseInt(params.id);

    await workoutProgramsService.update(programId, body, token);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Update program error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update program' },
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

    const programId = parseInt(params.id);
    await workoutProgramsService.delete(programId, token);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete program error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete program' },
      { status: 400 }
    );
  }
}

