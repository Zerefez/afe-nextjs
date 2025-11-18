import { Button, Card, CardContent, Navbar } from '@/shared/ui';
import { requireAuth } from '@/modules/auth';
import { getProgramsList } from '@/modules/programs';
import Link from 'next/link';

export default async function ProgramsListPage() {
  const { session, token } = await requireAuth();
  const { programs, clients } = await getProgramsList(token);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Navbar user={session.user} />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <Link href="/trainer/dashboard">
          <Button variant="ghost" size="sm">← Back to Dashboard</Button>
        </Link>
      </div>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 pb-12">
        <div className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-[34px] font-semibold text-[var(--color-text-primary)] tracking-tight">
              Workout Programs
            </h1>
            <p className="text-[var(--color-text-secondary)] mt-2 text-[15px]">
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
              <div className="text-center py-16">
                <h3 className="text-[22px] font-semibold text-[var(--color-text-primary)] mb-3">
                  No programs yet
                </h3>
                <p className="text-[var(--color-text-secondary)] mb-8 text-[15px]">
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
                <Card key={program.workoutProgramId} className="hover:shadow-[var(--shadow-md)] transition-all duration-200">
                  <CardContent>
                    <Link href={`/trainer/programs/${program.workoutProgramId}`}>
                      <div className="cursor-pointer">
                        <h3 className="text-[18px] font-semibold text-[var(--color-text-primary)] mb-2">
                          {program.name || 'Untitled Program'}
                        </h3>
                        <p className="text-[14px] text-[var(--color-text-secondary)] mb-4 line-clamp-3">
                          {program.description || 'No description'}
                        </p>
                        <div className="flex justify-between items-center text-[13px]">
                          <span className="text-[var(--color-text-tertiary)]">
                            {program.exercises?.length || 0} exercises
                          </span>
                          {client && (
                            <span className="text-[var(--color-text-primary)] font-medium">
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

