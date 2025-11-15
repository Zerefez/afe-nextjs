import { NextRequest, NextResponse } from 'next/server';
import { getToken, getSession } from '@/shared/lib/auth';
import { userService } from '@/shared/services';

export async function POST(request: NextRequest) {
  try {
    const token = await getToken();
    const session = await getSession();
    
    if (!token || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Create client with trainer ID
    const clientData = {
      ...body,
      accountType: 'Client',
      personalTrainerId: session.user.userId,
    };

    const user = await userService.create(clientData, token);

    return NextResponse.json(user);
  } catch (error: any) {
    console.error('Create client error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create client' },
      { status: 400 }
    );
  }
}

