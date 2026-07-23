/**
 * Legacy mock sessions for UI demos only.
 * Phase 1 auth uses `loginWithApi` — do not call `mockLogin` in production flows.
 */
import { AGENT_ROLES } from '../../constants/roles';
import type { AgentSession, LoginCredentials } from '../types/agent.types';

const MOCK_DEVICE_ID = 'amo-device-pilot-001';

export const mockSessionsByRole: Record<string, AgentSession> = {
  enrollment: {
    agentId: 'agent-enroll-001',
    fullName: 'Aminata Diarra',
    role: AGENT_ROLES.AGENT_ENROLLMENT,
    establishmentId: 'est-canam-bamako-01',
    establishmentName: 'Antenne CANAM Bamako Centre',
    deviceId: MOCK_DEVICE_ID,
  },
  carePoint: {
    agentId: 'agent-care-001',
    fullName: 'Ibrahim Traoré',
    role: AGENT_ROLES.AGENT_CARE_POINT,
    establishmentId: 'est-pharmacy-sotuba',
    establishmentName: 'Pharmacie Sotuba Conventionnée',
    deviceId: MOCK_DEVICE_ID,
  },
  supervisor: {
    agentId: 'agent-super-001',
    fullName: 'Fatoumata Keita',
    role: AGENT_ROLES.SUPERVISOR_ESTABLISHMENT,
    establishmentId: 'est-hospital-point-g',
    establishmentName: 'Hôpital du Point G',
    deviceId: MOCK_DEVICE_ID,
  },
};

/** @deprecated Use `loginWithApi` — kept for Storybook / UI fixtures only. */
export async function mockLogin(
  credentials: LoginCredentials,
): Promise<AgentSession> {
  await delay(600);

  const identifier = credentials.identifier.trim().toLowerCase();

  if (identifier.includes('soin') || identifier.includes('care')) {
    return mockSessionsByRole.carePoint;
  }

  if (identifier.includes('super')) {
    return mockSessionsByRole.supervisor;
  }

  return mockSessionsByRole.enrollment;
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
