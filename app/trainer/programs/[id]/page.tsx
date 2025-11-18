import { Button, Card, CardContent, CardHeader, CardTitle, Navbar } from '@/shared/ui';
import { requireAuth } from '@/modules/auth';
import { getProgramDetails } from '@/modules/programs';
import Link from 'next/link';
import ExerciseManager from './ExerciseManager';
import ProgramHeader from './ProgramHeader';

export default async function ProgramDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { session, token } = await requireAuth();
  const { id } = await params;
  const programId = parseInt(id);
  const { program, clients, assignedClient } = await getProgramDetails(programId, token);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Navbar user={session.user} />
      
      <main className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
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

