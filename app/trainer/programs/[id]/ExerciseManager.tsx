"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/Button';
import { Input, TextArea } from '@/app/components/Input';

interface Exercise {
  exerciseId: number;
  name: string | null;
  description: string | null;
  sets: number | null;
  repetitions: number | null;
  time: string | null;
}

interface ExerciseManagerProps {
  programId: number;
  initialExercises: Exercise[];
}

export default function ExerciseManager({ programId, initialExercises }: ExerciseManagerProps) {
  const router = useRouter();
  const [exercises, setExercises] = useState(initialExercises);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sets: '',
    repetitions: '',
    time: '',
  });
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      sets: '',
      repetitions: '',
      time: '',
    });
  };

  const handleAdd = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/programs/${programId}/exercises`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          sets: formData.sets ? parseInt(formData.sets) : null,
          repetitions: formData.repetitions ? parseInt(formData.repetitions) : null,
          time: formData.time || null,
        }),
      });

      if (!response.ok) throw new Error('Failed to add exercise');

      setIsAdding(false);
      resetForm();
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add exercise');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (exerciseId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/exercises/${exerciseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseId,
          name: formData.name,
          description: formData.description,
          sets: formData.sets ? parseInt(formData.sets) : null,
          repetitions: formData.repetitions ? parseInt(formData.repetitions) : null,
          time: formData.time || null,
        }),
      });

      if (!response.ok) throw new Error('Failed to update exercise');

      setEditingId(null);
      resetForm();
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update exercise');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (exerciseId: number) => {
    if (!confirm('Delete this exercise?')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/exercises/${exerciseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete exercise');

      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete exercise');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (exercise: Exercise) => {
    setEditingId(exercise.exerciseId);
    setFormData({
      name: exercise.name || '',
      description: exercise.description || '',
      sets: exercise.sets?.toString() || '',
      repetitions: exercise.repetitions?.toString() || '',
      time: exercise.time || '',
    });
  };

  if (exercises.length === 0 && !isAdding) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400 mb-4">No exercises yet</p>
        <Button onClick={() => setIsAdding(true)}>Add First Exercise</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {exercises.map((exercise) => (
        <div key={exercise.exerciseId} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          {editingId === exercise.exerciseId ? (
            <div className="space-y-3">
              <Input
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <TextArea
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
              <div className="grid grid-cols-3 gap-3">
                <Input
                  type="number"
                  label="Sets"
                  value={formData.sets}
                  onChange={(e) => setFormData({ ...formData, sets: e.target.value })}
                />
                <Input
                  type="number"
                  label="Reps"
                  value={formData.repetitions}
                  onChange={(e) => setFormData({ ...formData, repetitions: e.target.value })}
                />
                <Input
                  label="Time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleUpdate(exercise.exerciseId)} disabled={loading} size="sm">
                  Save
                </Button>
                <Button onClick={() => { setEditingId(null); resetForm(); }} variant="ghost" size="sm">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">{exercise.name}</h4>
                <div className="flex gap-2">
                  <Button onClick={() => startEdit(exercise)} variant="ghost" size="sm">Edit</Button>
                  <Button onClick={() => handleDelete(exercise.exerciseId)} variant="danger" size="sm">
                    Delete
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{exercise.description}</p>
              <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-500">
                {exercise.sets && <span>Sets: {exercise.sets}</span>}
                {exercise.repetitions && <span>Reps: {exercise.repetitions}</span>}
                {exercise.time && <span>Time: {exercise.time}</span>}
              </div>
            </>
          )}
        </div>
      ))}

      {isAdding && (
        <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">New Exercise</h4>
          <div className="space-y-3">
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <TextArea
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
            />
            <div className="grid grid-cols-3 gap-3">
              <Input
                type="number"
                label="Sets"
                value={formData.sets}
                onChange={(e) => setFormData({ ...formData, sets: e.target.value })}
              />
              <Input
                type="number"
                label="Reps"
                value={formData.repetitions}
                onChange={(e) => setFormData({ ...formData, repetitions: e.target.value })}
              />
              <Input
                label="Time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="e.g., 30 sec"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} disabled={loading} size="sm">
                Add Exercise
              </Button>
              <Button onClick={() => { setIsAdding(false); resetForm(); }} variant="ghost" size="sm">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {!isAdding && (
        <Button onClick={() => setIsAdding(true)} variant="secondary" className="w-full">
          + Add Exercise
        </Button>
      )}
    </div>
  );
}

