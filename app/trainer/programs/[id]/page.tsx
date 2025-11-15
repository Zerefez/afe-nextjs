import { Button } from '@/app/components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/Card';
import { Navbar } from '@/app/components/Navbar';
import { getSession, getToken } from '@/lib/auth';
import { usersService } from '@/lib/services/users';
import { workoutProgramsService } from '@/lib/services/workoutPrograms';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import ExerciseManager from './ExerciseManager';
import ProgramHeader from './ProgramHeader';
import { ApiError } from '@/lib/apiClient';

export default async function ProgramDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  const token = await getToken();

  if (!session || !token) {
    redirect('/login');
  }

  const { id } = await params;
  const programId = parseInt(id);
  
  let program, clients, assignedClient;
  try {
    program = await workoutProgramsService.getById(programId, token);
    // Fetch clients for assignment dropdown
    clients = await usersService.getClients(token);
    assignedClient = clients.find(c => c.userId === program.clientId);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      redirect('/logout');
    }
    throw error;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Navbar user={session.user} />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/trainer/programs">
            <Button variant="ghost" size="sm">← Back to Programs</Button>
          </Link>
        </div>

        <ProgramHeader 
          programId={programId} 
          initialProgram={program}
          clients={clients}
          assignedClient={assignedClient}
        />

        <Card>
          <CardHeader>
            <CardTitle>Exercises ({program.exercises?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <ExerciseManager programId={programId} initialExercises={program.exercises || []} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

