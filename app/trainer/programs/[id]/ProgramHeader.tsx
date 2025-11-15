"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';
import ProgramActions from './ProgramActions';
import { useState } from 'react';
import type { ProgramHeaderProps } from '@/shared/types';

export default function ProgramHeader({ programId, initialProgram, clients, assignedClient }: ProgramHeaderProps) {
  const [program, setProgram] = useState(initialProgram);
  const [client, setClient] = useState(assignedClient);

  const handleProgramUpdate = (updatedProgram: any) => {
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
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
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
        <p className="text-gray-600 dark:text-gray-400">
          {program.description || 'No description provided'}
        </p>
      </CardContent>
    </Card>
  );
}

