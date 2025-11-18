import { NextRequest, NextResponse } from 'next/server';
import { getToken } from '@/shared/lib/auth';
import { programService } from '@/shared/services';

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
    console.log('Creating program with payload:', JSON.stringify(body, null, 2));
    
    const program = await programService.create(body, token);

    return NextResponse.json(program);
  } catch (error) {
    console.error('Create program error:', error);
    
    const message = error instanceof Error ? error.message : 'Failed to create program';
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

