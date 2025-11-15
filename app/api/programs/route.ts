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
  } catch (error: any) {
    console.error('Create program error:', error);
    console.error('Error details:', error.data || error);
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to create program',
        details: error.data || undefined
      },
      { status: error.status || 400 }
    );
  }
}

