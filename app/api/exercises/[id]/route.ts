import { NextRequest, NextResponse } from 'next/server';
import { getToken } from '@/shared/lib/auth';
import { exerciseService } from '@/shared/services';

export async function PUT(
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
    const exerciseId = parseInt(id);

    await exerciseService.update(exerciseId, body, token);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update exercise error:', error);
    const message = error instanceof Error ? error.message : 'Failed to update exercise';
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken();
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const exerciseId = parseInt(id);
    
    console.log('Attempting to delete exercise:', exerciseId);
    await exerciseService.delete(exerciseId, token);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete exercise error:', error);
    
    const message = error instanceof Error ? error.message : 'Failed to delete exercise';
    const status = (error && typeof error === 'object' && 'status' in error && typeof error.status === 'number') ? error.status : 400;
    const data = (error && typeof error === 'object' && 'data' in error) ? error.data : undefined;
    
    return NextResponse.json(
      { 
        error: message,
        details: data
      },
      { status }
    );
  }
}

