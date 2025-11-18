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

    const clients = await userService.getClients(token);
    return NextResponse.json(clients);
  } catch (error) {
    console.error('Fetch clients error:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch clients';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

