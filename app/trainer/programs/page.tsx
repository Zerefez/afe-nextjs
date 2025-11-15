import { Button, Card, CardContent, Navbar } from '@/shared/ui';
import { requireAuth } from '@/modules/auth';
import { getProgramsList } from '@/modules/programs';
import Link from 'next/link';

export default async function ProgramsListPage() {
  const { session, token } = await requireAuth();
  const { programs, clients } = await getProgramsList(token);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Navbar user={session.user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/trainer/dashboard">
            <Button variant="ghost" size="sm">← Back to Dashboard</Button>
          </Link>
        </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Workout Programs
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage all your workout programs
            </p>
          </div>
          <Link href="/trainer/programs/new">
            <Button>Create Program</Button>
          </Link>
        </div>

        {programs.length === 0 ? (
          <Card>
            <CardContent>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No programs yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Create your first workout program to get started
                </p>
                <Link href="/trainer/programs/new">
                  <Button>Create Program</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => {
              const client = clients.find(c => c.userId === program.clientId);
              return (
                <Card key={program.workoutProgramId}>
                  <CardContent>
                    <Link href={`/trainer/programs/${program.workoutProgramId}`}>
                      <div className="cursor-pointer">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {program.name || 'Untitled Program'}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                          {program.description || 'No description'}
                        </p>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500 dark:text-gray-500">
                            {program.exercises?.length || 0} exercises
                          </span>
                          {client && (
                            <span className="text-blue-600 dark:text-blue-400 font-medium">
                              {client.firstName} {client.lastName}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

