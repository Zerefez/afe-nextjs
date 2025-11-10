import { getSession, getToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { usersService } from '@/lib/services/users';
import { Navbar } from '@/app/components/Navbar';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/Card';
import Link from 'next/link';
import { Button } from '@/app/components/Button';

export default async function ManagerDashboard() {
  const session = await getSession();
  const token = await getToken();

  if (!session || !token) {
    redirect('/login');
  }

  // Fetch all users
  const users = await usersService.getAll(token);
  
  // Separate by role
  const trainers = users.filter(u => u.accountType === 'PersonalTrainer');
  const clients = users.filter(u => u.accountType === 'Client');
  const managers = users.filter(u => u.accountType === 'Manager');

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar user={session.user} />
      
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-[32px] font-semibold text-black dark:text-white tracking-tight">
              Manager Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-500 mt-2 text-[15px]">
              Manage trainers and system users
            </p>
          </div>
          <Link href="/manager/users/new">
            <Button>Create User</Button>
          </Link>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Card>
            <CardContent>
              <div className="text-center py-4">
                <div className="text-[48px] font-semibold text-black dark:text-white tracking-tight leading-none">
                  {trainers.length}
                </div>
                <div className="text-gray-500 dark:text-gray-500 mt-3 text-[13px] uppercase tracking-wider">
                  Personal Trainers
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="text-center py-4">
                <div className="text-[48px] font-semibold text-black dark:text-white tracking-tight leading-none">
                  {clients.length}
                </div>
                <div className="text-gray-500 dark:text-gray-500 mt-3 text-[13px] uppercase tracking-wider">
                  Clients
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="text-center py-4">
                <div className="text-[48px] font-semibold text-black dark:text-white tracking-tight leading-none">
                  {users.length}
                </div>
                <div className="text-gray-500 dark:text-gray-500 mt-3 text-[13px] uppercase tracking-wider">
                  Total Users
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Personal Trainers List */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Personal Trainers</CardTitle>
          </CardHeader>
          <CardContent>
            {trainers.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-500 text-[15px]">No trainers yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <th className="text-left py-3 px-4 text-[13px] font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="text-left py-3 px-4 text-[13px] font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="text-left py-3 px-4 text-[13px] font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">Clients</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trainers.map((trainer) => {
                      const trainerClients = clients.filter(c => c.personalTrainerId === trainer.userId);
                      return (
                        <tr key={trainer.userId} className="border-b border-gray-100 dark:border-gray-900">
                          <td className="py-4 px-4 text-black dark:text-white text-[15px]">
                            {trainer.firstName} {trainer.lastName}
                          </td>
                          <td className="py-4 px-4 text-gray-600 dark:text-gray-400 text-[15px]">
                            {trainer.email}
                          </td>
                          <td className="py-4 px-4 text-gray-600 dark:text-gray-400 text-[15px]">
                            {trainerClients.length}
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

        {/* Clients List */}
        <Card>
          <CardHeader>
            <CardTitle>All Clients</CardTitle>
          </CardHeader>
          <CardContent>
            {clients.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-500 text-[15px]">No clients yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <th className="text-left py-3 px-4 text-[13px] font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="text-left py-3 px-4 text-[13px] font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="text-left py-3 px-4 text-[13px] font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">Trainer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => {
                      const trainer = trainers.find(t => t.userId === client.personalTrainerId);
                      return (
                        <tr key={client.userId} className="border-b border-gray-100 dark:border-gray-900">
                          <td className="py-4 px-4 text-black dark:text-white text-[15px]">
                            {client.firstName} {client.lastName}
                          </td>
                          <td className="py-4 px-4 text-gray-600 dark:text-gray-400 text-[15px]">
                            {client.email}
                          </td>
                          <td className="py-4 px-4 text-gray-600 dark:text-gray-400 text-[15px]">
                            {trainer ? `${trainer.firstName} ${trainer.lastName}` : 'N/A'}
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

