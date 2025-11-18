"use client";

import { Button, Input, TextArea } from '@/shared/ui';
import type {
  Exercise,
  ExerciseCardProps,
  ExerciseFormData,
  ExerciseFormProps,
  ExerciseManagerProps
} from '@/shared/types';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const EMPTY_FORM: ExerciseFormData = { name: '', description: '', sets: '', repetitions: '', time: '' };

export default function ExerciseManager({ programId, initialExercises }: ExerciseManagerProps) {
  const router = useRouter();
  const [exercises, setExercises] = useState(initialExercises);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ExerciseFormData>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  const lastInitialIdsRef = useRef<string>('');
  const localUpdateInProgressRef = useRef<boolean>(false);

  // Sync with server only when exercise IDs actually change
  useEffect(() => {
    if (localUpdateInProgressRef.current) {
      localUpdateInProgressRef.current = false;
      return;
    }

    const newIds = JSON.stringify(initialExercises.map(e => e.exerciseId).sort());
    if (lastInitialIdsRef.current !== newIds) {
      lastInitialIdsRef.current = newIds;
      setExercises(initialExercises);
    }
  }, [initialExercises]);

  const resetForm = () => setFormData(EMPTY_FORM);

  const buildExercisePayload = (exercise?: Exercise) => ({
    name: formData.name,
    description: formData.description,
    sets: formData.sets ? parseInt(formData.sets) : 0,
    repetitions: formData.repetitions ? parseInt(formData.repetitions) : 0,
    time: formData.time || "0",
    ...(exercise && {
      exerciseId: exercise.exerciseId,
      workoutProgramId: exercise.workoutProgramId || programId,
      personalTrainerId: exercise.personalTrainerId || null,
    }),
  });

  const handleApiCall = async (url: string, method: string, body?: unknown) => {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as { error?: string };
      throw new Error(errorData.error || `Failed to ${method.toLowerCase()} exercise`);
    }

    return method === 'POST' ? response.json() : null;
  };

  const handleAdd = async () => {
    setLoading(true);
    try {
      const newExercise = await handleApiCall(
        `/api/programs/${programId}/exercises`,
        'POST',
        buildExercisePayload()
      );

      localUpdateInProgressRef.current = true;
      setExercises([...exercises, newExercise]);
      setIsAdding(false);
      resetForm();
    } catch (err) {
      console.error('Add exercise error:', err);
      alert(err instanceof Error ? err.message : 'Failed to add exercise');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (exerciseId: number) => {
    setLoading(true);
    try {
      const currentExercise = exercises.find(ex => ex.exerciseId === exerciseId);
      const updatedData = buildExercisePayload(currentExercise);

      await handleApiCall(`/api/exercises/${exerciseId}`, 'PUT', updatedData);

      localUpdateInProgressRef.current = true;
      setExercises(exercises.map(ex => 
        ex.exerciseId === exerciseId ? { ...ex, ...updatedData } : ex
      ));

      setEditingId(null);
      resetForm();
    } catch (err) {
      console.error('Update exercise error:', err);
      alert(err instanceof Error ? err.message : 'Failed to update exercise');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (exerciseId: number) => {
    if (!confirm('Delete this exercise?')) return;

    setLoading(true);
    try {
      await handleApiCall(`/api/exercises/${exerciseId}`, 'DELETE');
      console.log('Exercise deleted successfully:', exerciseId);
    } catch (err) {
      console.warn('Backend delete failed, removing from local state only');
    } finally {
      localUpdateInProgressRef.current = true;
      setExercises(exercises.filter(ex => ex.exerciseId !== exerciseId));
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

  const cancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  const cancelAdd = () => {
    setIsAdding(false);
    resetForm();
  };

  // Empty state
  if (exercises.length === 0 && !isAdding) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--color-text-secondary)] mb-6 text-[15px]">No exercises yet</p>
        <Button onClick={() => setIsAdding(true)}>Add First Exercise</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {exercises.map((exercise) => (
        <ExerciseCard
          key={exercise.exerciseId}
          exercise={exercise}
          isEditing={editingId === exercise.exerciseId}
          formData={formData}
          loading={loading}
          onEdit={startEdit}
          onDelete={handleDelete}
          onSave={handleUpdate}
          onCancel={cancelEdit}
          onFormChange={setFormData}
        />
      ))}

      {isAdding && (
        <ExerciseForm
          formData={formData}
          loading={loading}
          title="New Exercise"
          onSave={handleAdd}
          onCancel={cancelAdd}
          onFormChange={setFormData}
        />
      )}

      {!isAdding && (
        <Button onClick={() => setIsAdding(true)} variant="secondary" className="w-full">
          + Add Exercise
        </Button>
      )}
    </div>
  );
}

// Separate components for better organization
function ExerciseCard({ exercise, isEditing, formData, loading, onEdit, onDelete, onSave, onCancel, onFormChange }: ExerciseCardProps) {
  if (isEditing) {
    return (
      <div className="p-5 border border-[var(--color-border)] rounded-[var(--radius-md)]">
        <ExerciseForm
          formData={formData}
          loading={loading}
          onSave={() => onSave(exercise.exerciseId)}
          onCancel={onCancel}
          onFormChange={onFormChange}
                />
              </div>
    );
  }

  return (
    <div className="p-5 border border-[var(--color-border)] rounded-[var(--radius-md)]">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-[var(--color-text-primary)] text-[16px]">{exercise.name}</h4>
                <div className="flex gap-2">
          <Button onClick={() => onEdit(exercise)} variant="ghost" size="sm">Edit</Button>
          <Button onClick={() => onDelete(exercise.exerciseId)} variant="danger" size="sm">Delete</Button>
                </div>
              </div>
              <p className="text-[14px] text-[var(--color-text-secondary)] mb-3">{exercise.description}</p>
              <div className="flex gap-4 text-[13px] text-[var(--color-text-tertiary)]">
                {exercise.sets && <span>Sets: {exercise.sets}</span>}
                {exercise.repetitions && <span>Reps: {exercise.repetitions}</span>}
                {exercise.time && <span>Time: {exercise.time}</span>}
              </div>
        </div>
  );
}

function ExerciseForm({ formData, loading, title, onSave, onCancel, onFormChange }: ExerciseFormProps) {
  const updateField = (field: keyof ExerciseFormData, value: string) => {
    onFormChange({ ...formData, [field]: value });
  };

  const formClass = title ? "p-5 border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-md)]" : "";

  return (
    <div className={formClass}>
      {title && <h4 className="font-semibold mb-4 text-[var(--color-text-primary)] text-[16px]">{title}</h4>}
          <div className="space-y-3">
            <Input
              label="Name"
              value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
              required
            />
            <TextArea
              label="Description"
              value={formData.description}
          onChange={(e) => updateField('description', e.target.value)}
              rows={2}
            />
            <div className="grid grid-cols-3 gap-3">
              <Input
                type="number"
                label="Sets"
                value={formData.sets}
            onChange={(e) => updateField('sets', e.target.value)}
              />
              <Input
                type="number"
                label="Reps"
                value={formData.repetitions}
            onChange={(e) => updateField('repetitions', e.target.value)}
              />
              <Input
                label="Time"
                value={formData.time}
            onChange={(e) => updateField('time', e.target.value)}
                placeholder="e.g., 30 sec"
              />
            </div>
            <div className="flex gap-2">
          <Button onClick={onSave} disabled={loading} size="sm">
            {loading ? 'Saving...' : title ? 'Add Exercise' : 'Save'}
              </Button>
          <Button onClick={onCancel} variant="ghost" size="sm">Cancel</Button>
        </div>
      </div>
    </div>
  );
}
