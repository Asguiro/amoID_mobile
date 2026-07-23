import type { AgentRole } from '../../constants/roles';

export interface AgentSession {
  agentId: string;
  fullName: string;
  role: AgentRole;
  establishmentId: string;
  establishmentName: string;
  deviceId: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  identifier: string;
  password: string;
  pin?: string;
}
