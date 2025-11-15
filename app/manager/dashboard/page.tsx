'use client';

import { Button } from '@/app/components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/Card';
import { Navbar } from '@/app/components/Navbar';
import {
  DashboardData,
  SortField,
  SortOrder,
  SortState,
  User,
} from '@/lib/types/manager';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function SortHeader({
  label,
  field,
  currentSort,
  onSort,
}: {
  label: string;
  field: SortField;
  currentSort: { field: SortField; order: SortOrder };
  onSort: (field: SortField) => void;
}) {
  const isActive = currentSort.field === field;
  const arrow = isActive ? (currentSort.order === 'asc' ? ' ↑' : ' ↓') : '';

  return (
    <th
      onClick={() => onSort(field)}
      className="text-left py-3 px-4 text-[13px] font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
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
    users: User[],
    sort: SortState,
    trainers?: User[]
  ): User[] => {
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
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  const sortedTrainers = sortData(data.trainers, trainerSort, data.clients);
  const sortedClients = sortData(data.clients, clientSort, data.trainers);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar user={data.user} />

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
                  {data.stats.trainers}
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
                  {data.stats.clients}
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
                  {data.stats.total}
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
            {data.trainers.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-500 text-[15px]">No trainers yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
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
            {data.clients.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-500 text-[15px]">No clients yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
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
                        <tr key={client.userId} className="border-b border-gray-100 dark:border-gray-900">
                          <td className="py-4 px-4 text-black dark:text-white text-[15px]">
                            {client.firstName} {client.lastName}
                          </td>
                          <td className="py-4 px-4 text-gray-600 dark:text-gray-400 text-[15px]">
                            {client.email}
                          </td>
                          <td className="py-4 px-4 text-gray-600 dark:text-gray-400 text-[15px]">
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

