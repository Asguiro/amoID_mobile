export const AGENT_ROLES = {
  ADMIN: 'ADMIN',
  SUPERVISOR_REGIONAL: 'SUPERVISOR_REGIONAL',
  AGENT_ENROLLMENT: 'AGENT_ENROLLMENT',
  AGENT_CARE_POINT: 'AGENT_CARE_POINT',
  SUPERVISOR_ESTABLISHMENT: 'SUPERVISOR_ESTABLISHMENT',
  AUDITOR: 'AUDITOR',
} as const;

export type AgentRole = (typeof AGENT_ROLES)[keyof typeof AGENT_ROLES];

export const ENROLLMENT_ROLES: readonly AgentRole[] = [
  AGENT_ROLES.ADMIN,
  AGENT_ROLES.SUPERVISOR_REGIONAL,
  AGENT_ROLES.AGENT_ENROLLMENT,
];

export const CARE_POINT_ROLES: readonly AgentRole[] = [
  AGENT_ROLES.ADMIN,
  AGENT_ROLES.AGENT_CARE_POINT,
  AGENT_ROLES.SUPERVISOR_ESTABLISHMENT,
];

export const AUDIT_ROLES: readonly AgentRole[] = [
  AGENT_ROLES.ADMIN,
  AGENT_ROLES.AUDITOR,
  AGENT_ROLES.SUPERVISOR_REGIONAL,
];

export function hasEnrollmentAccess(role: AgentRole): boolean {
  return ENROLLMENT_ROLES.includes(role);
}

export function hasCarePointAccess(role: AgentRole): boolean {
  return CARE_POINT_ROLES.includes(role);
}

export function hasAuditAccess(role: AgentRole): boolean {
  return AUDIT_ROLES.includes(role);
}

export function hasTemporaryQrAccess(role: AgentRole): boolean {
  return hasEnrollmentAccess(role) || hasCarePointAccess(role);
}
