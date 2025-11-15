import { Button } from '@/app/components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/Card';
import { Navbar } from '@/app/components/Navbar';
import { ApiError } from '@/lib/apiClient';
import { getSession, getToken } from '@/lib/auth';
import { usersService } from '@/lib/services/users';
import { workoutProgramsService } from '@/lib/services/workoutPrograms';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function TrainerDashboard() {
  const session = await getSession();
  const token = await getToken();

  if (!session || !token) {
    redirect('/login');
  }

  // Fetch trainer's clients and programs
  let clients, programs;
  try {
    [clients, programs] = await Promise.all([
      usersService.getClients(token),
      workoutProgramsService.getByTrainer(token),
    ]);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      redirect('/logout');
    }
    throw error;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar user={session.user} />
      
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="mb-12 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-[32px] font-semibold text-black dark:text-white tracking-tight">
              Trainer Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-500 mt-2 text-[15px]">
              Manage your clients and workout programs
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/trainer/clients/new">
              <Button variant="secondary">Add Client</Button>
            </Link>
            <Link href="/trainer/programs/new">
              <Button>Create Program</Button>
            </Link>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <Card>
            <CardContent>
              <div className="text-center py-4">
                <div className="text-[48px] font-semibold text-black dark:text-white tracking-tight leading-none">
                  {clients.length}
                </div>
                <div className="text-gray-500 dark:text-gray-500 mt-3 text-[13px] uppercase tracking-wider">
                  Active Clients
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="text-center py-4">
                <div className="text-[48px] font-semibold text-black dark:text-white tracking-tight leading-none">
                  {programs.length}
                </div>
                <div className="text-gray-500 dark:text-gray-500 mt-3 text-[13px] uppercase tracking-wider">
                  Workout Programs
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workout Programs */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Workout Programs</CardTitle>
              <Link href="/trainer/programs">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {programs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400 mb-4">No programs yet.</p>
                <Link href="/trainer/programs/new">
                  <Button>Create Your First Program</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {programs.slice(0, 6).map((program) => {
                  const client = clients.find(c => c.userId === program.clientId);
                  return (
                    <Link key={program.workoutProgramId} href={`/trainer/programs/${program.workoutProgramId}`}>
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          {program.name || 'Untitled Program'}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                          {program.description || 'No description'}
                        </p>
                        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-500">
                          <span>{program.exercises?.length || 0} exercises</span>
                          <span>{client ? `${client.firstName} ${client.lastName}` : 'Unassigned'}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Clients List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Clients</CardTitle>
          </CardHeader>
          <CardContent>
            {clients.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400 mb-4">No clients assigned yet.</p>
                <Link href="/trainer/clients/new">
                  <Button>Add Your First Client</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Programs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => {
                      const clientPrograms = programs.filter(p => p.clientId === client.userId);
                      return (
                        <tr key={client.userId} className="border-b border-gray-100 dark:border-gray-800">
                          <td className="py-3 px-4 text-gray-900 dark:text-white">
                            {client.firstName} {client.lastName}
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                            {client.email}
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                            {clientPrograms.length}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

