// Groups API service
import { api } from '../apiClient';
import { CreateGroupDto } from '../types';

export const groupsService = {
  // Create group (setup endpoint)
  create: (group: CreateGroupDto) =>
    api.post<void>('/api/Groups', group),
};

