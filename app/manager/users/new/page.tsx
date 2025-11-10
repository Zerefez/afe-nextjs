"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/app/components/Input';
import { Select } from '@/app/components/Input';
import { Button } from '@/app/components/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/Card';
import Link from 'next/link';

export default function CreateUserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    accountType: 'PersonalTrainer',
    personalTrainerId: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [trainers, setTrainers] = useState<any[]>([]);

  useEffect(() => {
    // Fetch trainers for client assignment
    const fetchTrainers = async () => {
      try {
        const response = await fetch('/api/users/trainers');
        if (response.ok) {
          const data = await response.json();
          setTrainers(data);
        }
      } catch (err) {
        console.error('Error fetching trainers:', err);
      }
    };
    fetchTrainers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        personalTrainerId: formData.accountType === 'Client' && formData.personalTrainerId 
          ? parseInt(formData.personalTrainerId) 
          : null,
      };

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create user');
      }

      router.push('/manager/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black p-6">
      <div className="max-w-2xl mx-auto py-8">
        <div className="mb-8">
          <Link href="/manager/dashboard">
            <Button variant="ghost" size="sm">← Back</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create New User</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
                <Input
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>

              <Input
                type="email"
                label="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />

              <Input
                type="password"
                label="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={2}
              />

              <Select
                label="Account Type"
                value={formData.accountType}
                onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                required
              >
                <option value="PersonalTrainer">Personal Trainer</option>
                <option value="Client">Client</option>
              </Select>

              {formData.accountType === 'Client' && (
                <Select
                  label="Assign to Trainer"
                  value={formData.personalTrainerId}
                  onChange={(e) => setFormData({ ...formData, personalTrainerId: e.target.value })}
                  required
                >
                  <option value="">Select a trainer</option>
                  {trainers.map((trainer) => (
                    <option key={trainer.userId} value={trainer.userId}>
                      {trainer.firstName} {trainer.lastName}
                    </option>
                  ))}
                </Select>
              )}

            {error && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
                <p className="text-[13px] text-gray-700 dark:text-gray-300">{error}</p>
              </div>
            )}

              <div className="flex gap-3">
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? 'Creating...' : 'Create User'}
                </Button>
                <Link href="/manager/dashboard">
                  <Button type="button" variant="secondary">Cancel</Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

