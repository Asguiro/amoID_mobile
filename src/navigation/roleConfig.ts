import type { AgentRole } from '../constants/roles';
import {
  hasAuditAccess,
  hasCarePointAccess,
  hasEnrollmentAccess,
  hasTemporaryQrAccess,
} from '../constants/roles';
import { MAIN_STACK_ROUTES, type MainStackRouteName } from '../constants/routes';

export function isRouteAllowedForRole(
  route: MainStackRouteName,
  role: AgentRole,
): boolean {
  switch (route) {
    case MAIN_STACK_ROUTES.HOME:
    case MAIN_STACK_ROUTES.PROFILE:
      return true;
    case MAIN_STACK_ROUTES.BENEFICIARIES:
    case MAIN_STACK_ROUTES.BENEFICIARY_DETAIL:
    case MAIN_STACK_ROUTES.ENROLLMENT:
      return hasEnrollmentAccess(role);
    case MAIN_STACK_ROUTES.VERIFICATION:
      return hasCarePointAccess(role) || hasEnrollmentAccess(role);
    case MAIN_STACK_ROUTES.TEMPORARY_QR:
      return hasTemporaryQrAccess(role);
    case MAIN_STACK_ROUTES.AUDIT:
      return hasAuditAccess(role);
    default:
      return false;
  }
}

export function getAllowedRoutesForRole(role: AgentRole): MainStackRouteName[] {
  return Object.values(MAIN_STACK_ROUTES).filter(route =>
    isRouteAllowedForRole(route, role),
  );
}
