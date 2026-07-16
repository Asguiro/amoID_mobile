import type { AgentRole } from '../../constants/roles';

export interface AgentSession {
  agentId: string;
  fullName: string;
  role: AgentRole;
  establishmentId: string;
  establishmentName: string;
  deviceId: string;
}

export interface LoginCredentials {
  identifier: string;
  password: string;
  pin?: string;
}
