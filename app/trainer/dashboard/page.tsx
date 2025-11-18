import { requireAuth } from '@/modules/auth';
import { getTrainerDashboardData } from '@/modules/dashboard';
import { Button, Card, CardContent, CardHeader, CardTitle, Navbar } from '@/shared/ui';
import Link from 'next/link';

export default async function TrainerDashboard() {
  const { session, token } = await requireAuth();
  const { clients, programs } = await getTrainerDashboardData(token);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Navbar user={session.user} />
      
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="mb-12 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-[34px] font-semibold text-[var(--color-text-primary)] tracking-tight">
              Trainer Dashboard
            </h1>
            <p className="text-[var(--color-text-secondary)] mt-2 text-[15px]">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardContent>
              <div className="text-center py-6">
                <div className="text-[56px] font-semibold text-[var(--color-text-primary)] tracking-tight leading-none">
                  {clients.length}
                </div>
                <div className="text-[var(--color-text-secondary)] mt-4 text-[13px] uppercase tracking-wider font-medium">
                  Active Clients
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="text-center py-6">
                <div className="text-[56px] font-semibold text-[var(--color-text-primary)] tracking-tight leading-none">
                  {programs.length}
                </div>
                <div className="text-[var(--color-text-secondary)] mt-4 text-[13px] uppercase tracking-wider font-medium">
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
              <div className="text-center py-12">
                <p className="text-[var(--color-text-secondary)] mb-6 text-[15px]">No programs yet.</p>
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
                      <div className="p-5 border border-[var(--color-border)] rounded-[var(--radius-md)] hover:bg-[var(--color-hover)] transition-all duration-200">
                        <h4 className="font-semibold text-[var(--color-text-primary)] mb-2 text-[16px]">
                          {program.name || 'Untitled Program'}
                        </h4>
                        <p className="text-[14px] text-[var(--color-text-secondary)] mb-3 line-clamp-2">
                          {program.description || 'No description'}
                        </p>
                        <div className="flex justify-between items-center text-[12px] text-[var(--color-text-tertiary)]">
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
              <div className="text-center py-12">
                <p className="text-[var(--color-text-secondary)] mb-6 text-[15px]">No clients assigned yet.</p>
                <Link href="/trainer/clients/new">
                  <Button>Add Your First Client</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--color-border)]">
                      <th className="text-left py-4 px-4 text-[13px] font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Name</th>
                      <th className="text-left py-4 px-4 text-[13px] font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Email</th>
                      <th className="text-left py-4 px-4 text-[13px] font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Programs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => {
                      const clientPrograms = programs.filter(p => p.clientId === client.userId);
                      return (
                        <tr key={client.userId} className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-4 px-4 text-[var(--color-text-primary)] text-[15px]">
                            {client.firstName} {client.lastName}
                          </td>
                          <td className="py-4 px-4 text-[var(--color-text-secondary)] text-[15px]">
                            {client.email}
                          </td>
                          <td className="py-4 px-4 text-[var(--color-text-secondary)] text-[15px]">
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

