import { requireAuth } from '@/modules/auth';
import { getClientProgramDetails } from '@/modules/programs';
import { Button, Card, CardContent, CardHeader, CardTitle, Navbar } from '@/shared/ui';
import Link from 'next/link';

export default async function ClientProgramDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { session, token } = await requireAuth();
  const { id } = await params;
  const programId = parseInt(id);
  const { program } = await getClientProgramDetails(programId, token);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Navbar user={session.user} />
      
      <main className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/client/dashboard">
            <Button variant="ghost" size="sm">← Back to Dashboard</Button>
          </Link>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{program.name || 'Workout Program'}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[var(--color-text-secondary)] text-[15px]">
              {program.description || 'No description provided'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exercises ({program.exercises?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {!program.exercises || program.exercises.length === 0 ? (
              <p className="text-[var(--color-text-secondary)] text-center py-12 text-[15px]">
                No exercises in this program yet.
              </p>
            ) : (
              <div className="space-y-4">
                {program.exercises.map((exercise, index) => (
                  <div key={exercise.exerciseId} className="p-6 border border-[var(--color-border)] rounded-[var(--radius-md)] bg-[var(--color-card-bg)]">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-[18px] font-semibold text-[var(--color-text-primary)]">
                        {index + 1}. {exercise.name}
                      </h3>
                      <div className="flex gap-2 flex-wrap justify-end">
                        {exercise.sets && (
                          <span className="bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] px-3 py-1 rounded-[var(--radius-sm)] text-[13px] font-medium">
                            {exercise.sets} Sets
                          </span>
                        )}
                        {exercise.repetitions && (
                          <span className="bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] px-3 py-1 rounded-[var(--radius-sm)] text-[13px] font-medium">
                            {exercise.repetitions} Reps
                          </span>
                        )}
                        {exercise.time && (
                          <span className="bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] px-3 py-1 rounded-[var(--radius-sm)] text-[13px] font-medium">
                            {exercise.time}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-[var(--color-text-secondary)] leading-relaxed text-[14px]">
                      {exercise.description || 'No description provided'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

