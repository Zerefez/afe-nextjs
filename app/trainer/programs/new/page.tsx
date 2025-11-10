"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input, TextArea, Select } from '@/app/components/Input';
import { Button } from '@/app/components/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/Card';
import Link from 'next/link';

interface Exercise {
  name: string;
  description: string;
  sets: number | null;
  repetitions: number | null;
  time: string;
}

export default function CreateProgramPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    clientId: '',
  });
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/users/my-clients');
        if (response.ok) {
          const data = await response.json();
          setClients(data);
        }
      } catch (err) {
        console.error('Error fetching clients:', err);
      }
    };
    fetchClients();
  }, []);

  const addExercise = () => {
    setExercises([
      ...exercises,
      { name: '', description: '', sets: null, repetitions: null, time: '' },
    ]);
  };

  const updateExercise = (index: number, field: keyof Exercise, value: any) => {
    const updated = [...exercises];
    updated[index] = { ...updated[index], [field]: value };
    setExercises(updated);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        clientId: formData.clientId ? parseInt(formData.clientId) : null,
        exercises: exercises.map(ex => ({
          name: ex.name,
          description: ex.description,
          sets: ex.sets ? parseInt(ex.sets.toString()) : null,
          repetitions: ex.repetitions ? parseInt(ex.repetitions.toString()) : null,
          time: ex.time || null,
        })),
      };

      const response = await fetch('/api/programs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create program');
      }

      const result = await response.json();
      router.push(`/trainer/programs/${result.workoutProgramId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="mb-6">
          <Link href="/trainer/programs">
            <Button variant="ghost" size="sm">← Back to Programs</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Workout Program</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Program Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Full Body Workout"
                required
              />

              <TextArea
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the workout program..."
                rows={3}
              />

              <Select
                label="Assign to Client (Optional)"
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              >
                <option value="">No client (unassigned)</option>
                {clients.map((client) => (
                  <option key={client.userId} value={client.userId}>
                    {client.firstName} {client.lastName}
                  </option>
                ))}
              </Select>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Exercises
                  </h3>
                  <Button type="button" variant="secondary" size="sm" onClick={addExercise}>
                    + Add Exercise
                  </Button>
                </div>

                {exercises.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No exercises added yet. Click "Add Exercise" to get started.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {exercises.map((exercise, index) => (
                      <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            Exercise {index + 1}
                          </h4>
                          <Button
                            type="button"
                            variant="danger"
                            size="sm"
                            onClick={() => removeExercise(index)}
                          >
                            Remove
                          </Button>
                        </div>
                        <div className="space-y-3">
                          <Input
                            label="Exercise Name"
                            value={exercise.name}
                            onChange={(e) => updateExercise(index, 'name', e.target.value)}
                            placeholder="e.g., Squats"
                            required
                          />
                          <TextArea
                            label="Description"
                            value={exercise.description}
                            onChange={(e) => updateExercise(index, 'description', e.target.value)}
                            placeholder="Describe how to perform this exercise..."
                            rows={2}
                          />
                          <div className="grid grid-cols-3 gap-3">
                            <Input
                              type="number"
                              label="Sets"
                              value={exercise.sets || ''}
                              onChange={(e) => updateExercise(index, 'sets', e.target.value)}
                              placeholder="3"
                            />
                            <Input
                              type="number"
                              label="Repetitions"
                              value={exercise.repetitions || ''}
                              onChange={(e) => updateExercise(index, 'repetitions', e.target.value)}
                              placeholder="10"
                            />
                            <Input
                              label="Time"
                              value={exercise.time}
                              onChange={(e) => updateExercise(index, 'time', e.target.value)}
                              placeholder="30 sec"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Program'}
                </Button>
                <Link href="/trainer/programs">
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

