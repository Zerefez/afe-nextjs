'use client';

import { Button, Card, CardContent, CardHeader, CardTitle, Navbar } from '@/shared/ui';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { UserDto } from '@/shared/types';

type SortField = 'name' | 'email' | 'clients' | 'trainer';
type SortOrder = 'asc' | 'desc';
type SortState = { field: SortField; order: SortOrder };

interface DashboardData {
  user: UserDto;
  trainers: UserDto[];
  clients: UserDto[];
  stats: {
    trainers: number;
    clients: number;
    total: number;
  };
}

function SortHeader({
  label,
  field,
  currentSort,
  onSort,
}: {
  label: string;
  field: SortField;
  currentSort: SortState;
  onSort: (field: SortField) => void;
}) {
  const isActive = currentSort.field === field;
  const arrow = isActive ? (currentSort.order === 'asc' ? ' ↑' : ' ↓') : '';

  return (
    <th
      onClick={() => onSort(field)}
      className="text-left py-4 px-4 text-[13px] font-medium text-[var(--color-text-secondary)] uppercase tracking-wider cursor-pointer hover:text-[var(--color-text-primary)] transition-colors"
    >
      {label}
      {arrow}
    </th>
  );
}

export default function ManagerDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [trainerSort, setTrainerSort] = useState<SortState>({
    field: 'name',
    order: 'asc',
  });
  const [clientSort, setClientSort] = useState<SortState>({
    field: 'name',
    order: 'asc',
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/manager/dashboard', {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          if (response.status === 401) {
            // Clear session before redirecting
            await fetch('/api/auth/logout', {
              method: 'POST',
              credentials: 'include',
            });
            window.location.href = '/login';
            return;
          }
          throw new Error('Failed to fetch');
        }
        const dashboardData = await response.json();
        setData(dashboardData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    }

    fetchData();
  }, []);

  const sortData = (
    users: UserDto[],
    sort: SortState,
    trainers?: UserDto[]
  ): UserDto[] => {
    const sorted = [...users];

    sorted.sort((a, b) => {
      let comparison = 0;

      switch (sort.field) {
        case 'name':
          comparison = `${a.firstName} ${a.lastName}`.localeCompare(
            `${b.firstName} ${b.lastName}`
          );
          break;
        case 'email':
          comparison = a.email.localeCompare(b.email);
          break;
        case 'clients':
          if (trainers) {
            const aClients = trainers.filter(c => c.personalTrainerId === a.userId).length;
            const bClients = trainers.filter(c => c.personalTrainerId === b.userId).length;
            comparison = aClients - bClients;
          }
          break;
        case 'trainer':
          if (trainers) {
            const aTrainer = trainers.find(t => t.userId === a.personalTrainerId);
            const bTrainer = trainers.find(t => t.userId === b.personalTrainerId);
            const aTrainerName = aTrainer ? `${aTrainer.firstName} ${aTrainer.lastName}` : '';
            const bTrainerName = bTrainer ? `${bTrainer.firstName} ${bTrainer.lastName}` : '';
            comparison = aTrainerName.localeCompare(bTrainerName);
          }
          break;

        default:
          comparison = 0;
      }

      return sort.order === 'asc' ? comparison : -comparison;
    });

    return sorted;
  };

  const handleTrainerSort = (field: SortField) => {
    if (trainerSort.field === field) {
      setTrainerSort({
        field,
        order: trainerSort.order === 'asc' ? 'desc' : 'asc',
      });
    } else {
      setTrainerSort({ field, order: 'asc' });
    }
  };

  const handleClientSort = (field: SortField) => {
    if (clientSort.field === field) {
      setClientSort({
        field,
        order: clientSort.order === 'asc' ? 'desc' : 'asc',
      });
    } else {
      setClientSort({ field, order: 'asc' });
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="text-center text-[var(--color-text-secondary)] text-[15px]">Loading...</div>
      </div>
    );
  }

  const sortedTrainers = sortData(data.trainers, trainerSort, data.clients);
  const sortedClients = sortData(data.clients, clientSort, data.trainers);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Navbar user={data.user} />

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-[34px] font-semibold text-[var(--color-text-primary)] tracking-tight">
              Manager Dashboard
            </h1>
            <p className="text-[var(--color-text-secondary)] mt-2 text-[15px]">
              Manage trainers and system users
            </p>
          </div>
          <Link href="/manager/users/new">
            <Button>Create User</Button>
          </Link>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent>
              <div className="text-center py-6">
                <div className="text-[56px] font-semibold text-[var(--color-text-primary)] tracking-tight leading-none">
                  {data.stats.trainers}
                </div>
                <div className="text-[var(--color-text-secondary)] mt-4 text-[13px] uppercase tracking-wider font-medium">
                  Personal Trainers
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="text-center py-6">
                <div className="text-[56px] font-semibold text-[var(--color-text-primary)] tracking-tight leading-none">
                  {data.stats.clients}
                </div>
                <div className="text-[var(--color-text-secondary)] mt-4 text-[13px] uppercase tracking-wider font-medium">
                  Clients
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="text-center py-6">
                <div className="text-[56px] font-semibold text-[var(--color-text-primary)] tracking-tight leading-none">
                  {data.stats.total}
                </div>
                <div className="text-[var(--color-text-secondary)] mt-4 text-[13px] uppercase tracking-wider font-medium">
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
            {data.trainers.length === 0 ? (
              <p className="text-[var(--color-text-secondary)] text-[15px]">No trainers yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--color-border)]">
                      <SortHeader
                        label="Name"
                        field="name"
                        currentSort={trainerSort}
                        onSort={handleTrainerSort}
                      />
                      <SortHeader
                        label="Email"
                        field="email"
                        currentSort={trainerSort}
                        onSort={handleTrainerSort}
                      />
                      <SortHeader
                        label="Clients"
                        field="clients"
                        currentSort={trainerSort}
                        onSort={handleTrainerSort}
                      />
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTrainers.map((trainer) => {
                      const trainerClients = data.clients.filter(
                        c => c.personalTrainerId === trainer.userId
                      );
                      return (
                        <tr key={trainer.userId} className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-4 px-4 text-[var(--color-text-primary)] text-[15px]">
                            {trainer.firstName} {trainer.lastName}
                          </td>
                          <td className="py-4 px-4 text-[var(--color-text-secondary)] text-[15px]">
                            {trainer.email}
                          </td>
                          <td className="py-4 px-4 text-[var(--color-text-secondary)] text-[15px]">
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
            {data.clients.length === 0 ? (
              <p className="text-[var(--color-text-secondary)] text-[15px]">No clients yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--color-border)]">
                      <SortHeader
                        label="Name"
                        field="name"
                        currentSort={clientSort}
                        onSort={handleClientSort}
                      />
                      <SortHeader
                        label="Email"
                        field="email"
                        currentSort={clientSort}
                        onSort={handleClientSort}
                      />
                      <SortHeader
                        label="Trainer"
                        field="trainer"
                        currentSort={clientSort}
                        onSort={handleClientSort}
                      />
                    </tr>
                  </thead>
                  <tbody>
                    {sortedClients.map((client) => {
                      const trainer = data.trainers.find(
                        t => t.userId === client.personalTrainerId
                      );
                      return (
                        <tr key={client.userId} className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-4 px-4 text-[var(--color-text-primary)] text-[15px]">
                            {client.firstName} {client.lastName}
                          </td>
                          <td className="py-4 px-4 text-[var(--color-text-secondary)] text-[15px]">
                            {client.email}
                          </td>
                          <td className="py-4 px-4 text-[var(--color-text-secondary)] text-[15px]">
                            {trainer
                              ? `${trainer.firstName} ${trainer.lastName}`
                              : 'N/A'}
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

