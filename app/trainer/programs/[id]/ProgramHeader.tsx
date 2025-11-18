"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';
import ProgramActions from './ProgramActions';
import { useState } from 'react';
import type { ProgramHeaderProps, WorkoutProgram } from '@/shared/types';

export default function ProgramHeader({ programId, initialProgram, clients, assignedClient }: ProgramHeaderProps) {
  const [program, setProgram] = useState(initialProgram);
  const [client, setClient] = useState(assignedClient);

  const handleProgramUpdate = (updatedProgram: WorkoutProgram) => {
    setProgram(updatedProgram);
    const newClient = clients.find(c => c.userId === updatedProgram.clientId);
    setClient(newClient);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{program.name || 'Untitled Program'}</CardTitle>
            {client && (
              <p className="text-[14px] text-[var(--color-text-primary)] mt-2 font-medium">
                Assigned to: {client.firstName} {client.lastName}
              </p>
            )}
          </div>
          <ProgramActions 
            programId={programId} 
            program={program} 
            clients={clients}
            onUpdate={handleProgramUpdate}
          />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-[var(--color-text-secondary)] text-[15px]">
          {program.description || 'No description provided'}
        </p>
      </CardContent>
    </Card>
  );
}

