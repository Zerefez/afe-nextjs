"use client";

import type { ProgramActionsProps } from '@/shared/types';
import { Button, Input, Select, TextArea } from '@/shared/ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ProgramActions({ programId, program, clients, onUpdate }: ProgramActionsProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: program.name || '',
    description: program.description || '',
    clientId: program.clientId?.toString() || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpdate = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/programs/${programId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workoutProgramId: programId,
          name: formData.name,
          description: formData.description,
          personalTrainerId: program.personalTrainerId,
          clientId: formData.clientId ? parseInt(formData.clientId) : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update program');
      }

      // Update the parent component's state
      const updatedProgram = {
        ...program,
        name: formData.name,
        description: formData.description,
        clientId: formData.clientId ? parseInt(formData.clientId) : null,
      };
      
      if (onUpdate) {
        onUpdate(updatedProgram);
      }

      setIsEditing(false);
      // Don't call router.refresh() to avoid resetting exercises state
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this program? This will also delete all exercises.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/programs/${programId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete program');
      }

      router.push('/trainer/programs');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
      setLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-4 w-full mt-4">
        <Input
          label="Program Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <TextArea
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
        <Select
          label="Assign to Client"
          value={formData.clientId}
          onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
        >
          <option value="">No client</option>
          {clients.map((client) => (
            <option key={client.userId} value={client.userId}>
              {client.firstName} {client.lastName}
            </option>
          ))}
        </Select>
        {error && <p className="text-[13px] text-[var(--color-text-primary)]">{error}</p>}
        <div className="flex gap-2">
          <Button onClick={handleUpdate} disabled={loading} size="sm">
            {loading ? 'Saving...' : 'Save'}
          </Button>
          <Button onClick={() => setIsEditing(false)} variant="ghost" size="sm">
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button onClick={() => setIsEditing(true)} variant="secondary" size="sm">
        Edit
      </Button>
      <Button onClick={handleDelete} variant="danger" size="sm" disabled={loading}>
        Delete
      </Button>
    </div>
  );
}

