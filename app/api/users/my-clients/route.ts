import { NextResponse } from 'next/server';
import { getToken } from '@/lib/auth';
import { usersService } from '@/lib/services/users';

export async function GET() {
  try {
    const token = await getToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const clients = await usersService.getClients(token);
    return NextResponse.json(clients);
  } catch (error: any) {
    console.error('Fetch clients error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

