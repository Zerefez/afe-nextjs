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
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Navbar user={session.user} />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            {!program.exercises || program.exercises.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                No exercises in this program yet.
              </p>
            ) : (
              <div className="space-y-4">
                {program.exercises.map((exercise, index) => (
                  <div key={exercise.exerciseId} className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-black">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {index + 1}. {exercise.name}
                      </h3>
                      <div className="flex gap-2 flex-wrap justify-end">
                        {exercise.sets && (
                          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                            {exercise.sets} Sets
                          </span>
                        )}
                        {exercise.repetitions && (
                          <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
                            {exercise.repetitions} Reps
                          </span>
                        )}
                        {exercise.time && (
                          <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium">
                            {exercise.time}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
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

