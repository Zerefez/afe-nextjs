import { getSession, getToken } from '@/shared/lib/auth';
import { userService } from '@/shared/services';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getSession();
    const token = await getToken();

    if (!session || !token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all users using the userService
    const users = await userService.getAll(token);

    // Transform API response to match our interface
    const transformedUsers = users.map((user: any) => ({
      userId: user.userId || user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      accountType: user.accountType,
      personalTrainerId: user.personalTrainerId,
    }));

    // Separate by role
    const trainers = transformedUsers.filter(
      (u: any) => u.accountType === 'PersonalTrainer'
    );
    const clients = transformedUsers.filter(
      (u: any) => u.accountType === 'Client'
    );

    return NextResponse.json({
      trainers,
      clients,
      stats: {
        trainers: trainers.length,
        clients: clients.length,
        total: transformedUsers.length,
      },
      user: {
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        accountType: session.user.accountType,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}

