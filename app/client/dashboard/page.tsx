import { Navbar, Card, CardHeader, CardTitle, CardContent, Button } from '@/shared/ui';
import { requireAuth } from '@/modules/auth';
import { getClientDashboardData } from '@/modules/dashboard';
import Link from 'next/link';

export default async function ClientDashboard() {
  const { session, token } = await requireAuth();
  const { programs, trainer } = await getClientDashboardData(token);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar user={session.user} />
      
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-[32px] font-semibold text-black dark:text-white tracking-tight">
            My Workout Programs
          </h1>
          <p className="text-gray-500 dark:text-gray-500 mt-2 text-[15px]">
            View your personalized workout programs
          </p>
        </div>

        {/* Trainer Info */}
        {trainer && (
          <Card className="mb-6">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] text-gray-500 dark:text-gray-500 uppercase tracking-wider">Your Personal Trainer</p>
                  <p className="text-[17px] font-semibold text-black dark:text-white mt-2">
                    {trainer.firstName} {trainer.lastName}
                  </p>
                  <p className="text-[15px] text-gray-600 dark:text-gray-400 mt-1">{trainer.email}</p>
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
                <h3 className="text-[22px] font-semibold text-black dark:text-white mb-2">
                  No programs yet
                </h3>
                <p className="text-gray-500 dark:text-gray-500 text-[15px]">
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
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {programs[0].description || 'No description'}
              </p>
              <div className="space-y-4">
                {programs[0].exercises?.map((exercise, index) => (
                  <div key={exercise.exerciseId} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {index + 1}. {exercise.name}
                      </h4>
                      <div className="flex gap-3 text-sm text-gray-600 dark:text-gray-400">
                        {exercise.sets && <span className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                          {exercise.sets} sets
                        </span>}
                        {exercise.repetitions && <span className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded">
                          {exercise.repetitions} reps
                        </span>}
                        {exercise.time && <span className="bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded">
                          {exercise.time}
                        </span>}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {exercise.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          // Multiple programs - show list
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You have {programs.length} workout programs. Click on one to view details.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program) => (
                <Link key={program.workoutProgramId} href={`/client/programs/${program.workoutProgramId}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardContent>
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
                        <span className="text-blue-600 dark:text-blue-400 font-medium">
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

