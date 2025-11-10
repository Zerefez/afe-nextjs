import { Button } from '@/app/components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/Card';
import { Navbar } from '@/app/components/Navbar';
import { getSession, getToken } from '@/lib/auth';
import { usersService } from '@/lib/services/users';
import { workoutProgramsService } from '@/lib/services/workoutPrograms';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import ExerciseManager from './ExerciseManager';
import ProgramActions from './ProgramActions';

export default async function ProgramDetailPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  const token = await getToken();

  if (!session || !token) {
    redirect('/login');
  }

  const programId = parseInt(params.id);
  const program = await workoutProgramsService.getById(programId, token);
  
  // Fetch clients for assignment dropdown
  const clients = await usersService.getClients(token);
  const assignedClient = clients.find(c => c.userId === program.clientId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar user={session.user} />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/trainer/programs">
            <Button variant="ghost" size="sm">← Back to Programs</Button>
          </Link>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{program.name || 'Untitled Program'}</CardTitle>
                {assignedClient && (
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                    Assigned to: {assignedClient.firstName} {assignedClient.lastName}
                  </p>
                )}
              </div>
              <ProgramActions programId={programId} program={program} clients={clients} />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              {program.description || 'No description provided'}
            </p>
          </CardContent>
        </Card>

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

