import { Navbar, Card, CardHeader, CardTitle, CardContent, Button } from '@/shared/ui';
import { requireAuth } from '@/modules/auth';
import { getClientDashboardData } from '@/modules/dashboard';
import Link from 'next/link';

export default async function ClientDashboard() {
  const { session, token } = await requireAuth();
  const { programs, trainer } = await getClientDashboardData(token);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Navbar user={session.user} />
      
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-[34px] font-semibold text-[var(--color-text-primary)] tracking-tight">
            My Workout Programs
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-2 text-[15px]">
            View your personalized workout programs
          </p>
        </div>

        {/* Trainer Info */}
        {trainer && (
          <Card className="mb-6">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] text-[var(--color-text-secondary)] uppercase tracking-wider font-medium">Your Personal Trainer</p>
                  <p className="text-[17px] font-semibold text-[var(--color-text-primary)] mt-2">
                    {trainer.firstName} {trainer.lastName}
                  </p>
                  <p className="text-[15px] text-[var(--color-text-secondary)] mt-1">{trainer.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Workout Programs */}
        {programs.length === 0 ? (
          <Card>
            <CardContent>
              <div className="text-center py-16">
                <h3 className="text-[22px] font-semibold text-[var(--color-text-primary)] mb-3">
                  No programs yet
                </h3>
                <p className="text-[var(--color-text-secondary)] text-[15px]">
                  Your trainer hasn't assigned any workout programs to you yet.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : programs.length === 1 ? (
          // If only one program, show it directly
          <Card>
            <CardHeader>
              <CardTitle>{programs[0].name || 'Workout Program'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[var(--color-text-secondary)] mb-8 text-[15px]">
                {programs[0].description || 'No description'}
              </p>
              <div className="space-y-4">
                {programs[0].exercises?.map((exercise, index) => (
                  <div key={exercise.exerciseId} className="p-5 border border-[var(--color-border)] rounded-[var(--radius-md)]">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-[var(--color-text-primary)] text-[16px]">
                        {index + 1}. {exercise.name}
                      </h4>
                      <div className="flex gap-2 text-[13px] text-[var(--color-text-secondary)]">
                        {exercise.sets && <span className="bg-[var(--color-surface-elevated)] px-3 py-1 rounded-[var(--radius-sm)] font-medium">
                          {exercise.sets} sets
                        </span>}
                        {exercise.repetitions && <span className="bg-[var(--color-surface-elevated)] px-3 py-1 rounded-[var(--radius-sm)] font-medium">
                          {exercise.repetitions} reps
                        </span>}
                        {exercise.time && <span className="bg-[var(--color-surface-elevated)] px-3 py-1 rounded-[var(--radius-sm)] font-medium">
                          {exercise.time}
                        </span>}
                      </div>
                    </div>
                    <p className="text-[14px] text-[var(--color-text-secondary)]">
                      {exercise.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          // Multiple programs - show list
          <div className="space-y-6">
            <p className="text-[var(--color-text-secondary)] text-[15px]">
              You have {programs.length} workout programs. Click on one to view details.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program) => (
                <Link key={program.workoutProgramId} href={`/client/programs/${program.workoutProgramId}`}>
                  <Card className="hover:shadow-[var(--shadow-md)] transition-all duration-200 cursor-pointer h-full">
                    <CardContent>
                      <h3 className="text-[18px] font-semibold text-[var(--color-text-primary)] mb-2">
                        {program.name || 'Untitled Program'}
                      </h3>
                      <p className="text-[14px] text-[var(--color-text-secondary)] mb-4 line-clamp-3">
                        {program.description || 'No description'}
                      </p>
                      <div className="flex justify-between items-center text-[14px]">
                        <span className="text-[var(--color-text-tertiary)]">
                          {program.exercises?.length || 0} exercises
                        </span>
                        <span className="text-[var(--color-text-primary)] font-medium">
                          View →
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

