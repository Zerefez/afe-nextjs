"use client";

import { Button, Card, CardContent, CardHeader, CardTitle, Input, Select, TextArea } from '@/shared/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
  const [clients, setClients] = useState<Array<{ userId: number; firstName?: string; lastName?: string; email: string }>>([]);
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

  const updateExercise = (index: number, field: keyof Exercise, value: string | number | null) => {
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
      interface ExercisePayload {
        name: string;
        description?: string | null;
        sets: number;
        repetitions: number;
        time: string;
      }
      
      interface ProgramPayload {
        name: string;
        description?: string;
        exercises: ExercisePayload[];
        clientId?: number;
      }
      
      const payload: ProgramPayload = {
        name: formData.name,
        description: formData.description,
        exercises: exercises.map(ex => ({
          name: ex.name,
          description: ex.description,
          sets: ex.sets ? parseInt(ex.sets.toString()) : 0,
          repetitions: ex.repetitions ? parseInt(ex.repetitions.toString()) : 0,
          time: ex.time || "0",
        })),
      };

      // Only include clientId if a client is selected
      if (formData.clientId) {
        payload.clientId = parseInt(formData.clientId);
      }

      const response = await fetch('/api/programs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        const errorMsg = data.error || 'Failed to create program';
        const details = data.details ? ` - ${JSON.stringify(data.details)}` : '';
        throw new Error(errorMsg + details);
      }

      const result = await response.json();
      router.push(`/trainer/programs/${result.workoutProgramId}`);
      router.refresh();
    } catch (err) {
      console.error('Error creating program:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] p-4">
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

              <div className="border-t border-[var(--color-border)] pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[18px] font-semibold text-[var(--color-text-primary)]">
                    Exercises
                  </h3>
                  <Button type="button" variant="secondary" size="sm" onClick={addExercise}>
                    + Add Exercise
                  </Button>
                </div>

                {exercises.length === 0 ? (
                  <p className="text-[var(--color-text-secondary)] text-[14px]">
                    No exercises added yet. Click &quot;Add Exercise&quot; to get started.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {exercises.map((exercise, index) => (
                      <div key={index} className="p-5 border border-[var(--color-border)] rounded-[var(--radius-md)]">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-medium text-[var(--color-text-primary)] text-[16px]">
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
                <div className="p-4 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-[var(--radius-md)]">
                  <p className="text-[13px] text-[var(--color-text-primary)]">{error}</p>
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

