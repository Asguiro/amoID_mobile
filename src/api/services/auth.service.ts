import { AGENT_ROLES, type AgentRole } from '../../constants/roles';
import { getMobileDeviceMeta } from '../device-id';
import { getMobileDeviceId, MobileApiError, mobileRequest } from '../client';
import type { AgentSession, LoginCredentials } from '../types/agent.types';

const API_TO_MOBILE_ROLE: Record<string, AgentRole> = {
  ENROLLMENT_AGENT: AGENT_ROLES.AGENT_ENROLLMENT,
  CARE_POINT_AGENT: AGENT_ROLES.AGENT_CARE_POINT,
  ESTABLISHMENT_SUPERVISOR: AGENT_ROLES.SUPERVISOR_ESTABLISHMENT,
  REGIONAL_SUPERVISOR: AGENT_ROLES.SUPERVISOR_REGIONAL,
  ADMIN_CENTRAL: AGENT_ROLES.ADMIN,
  AUDITOR: AGENT_ROLES.AUDITOR,
};

type LoginApiResponse = {
  accessToken?: string;
  refreshToken?: string;
  requiresOtp?: boolean;
  user?: {
    id: string;
    displayName: string;
    role: string;
    establishmentId: string;
  };
};

type MeApiResponse = {
  id: string;
  displayName: string;
  role: string;
  establishmentId: string;
  establishmentName: string;
};

type DeviceRegistrationResponse = {
  status: 'PENDING' | 'TRUSTED';
  message: string;
  deviceId: string;
};

export function mapAuthErrorCode(code: string): string | undefined {
  switch (code) {
    case 'DEVICE_REVOKED':
      return 'auth.errors.deviceRevoked';
    case 'DEVICE_UNKNOWN':
      return 'auth.errors.deviceUnknown';
    case 'DEVICE_PENDING':
      return 'auth.errors.devicePending';
    case 'DEVICE_REQUIRED':
      return 'auth.errors.deviceRequired';
    case 'AGENT_SUSPENDED':
      return 'auth.errors.agentSuspended';
    case 'INVALID_CREDENTIALS':
      return 'auth.errors.invalidCredentials';
    case 'OTP_REQUIRED':
      return 'auth.errors.otpRequired';
    default:
      return undefined;
  }
}

export function deviceAccessFromAuthCode(
  code: string,
): 'unknown' | 'pending' | 'revoked' | null {
  switch (code) {
    case 'DEVICE_REVOKED':
      return 'revoked';
    case 'DEVICE_PENDING':
      return 'pending';
    case 'DEVICE_UNKNOWN':
    case 'DEVICE_REQUIRED':
      return 'unknown';
    default:
      return null;
  }
}

export async function loginWithApi(
  credentials: LoginCredentials,
): Promise<AgentSession> {
  const identifier = credentials.identifier.trim();
  const password = credentials.password;

  if (!identifier || !password) {
    throw new MobileApiError(
      400,
      'VALIDATION_ERROR',
      'Identifiant et mot de passe obligatoires.',
    );
  }

  const login = await mobileRequest<LoginApiResponse>('/mobile/auth/login', {
    method: 'POST',
    body: { identifier, password },
    skipAuthRetry: true,
  });

  if (login.requiresOtp || !login.accessToken) {
    throw new MobileApiError(
      501,
      'OTP_REQUIRED',
      'OTP requis — non supporté en Phase 1 MVP.',
    );
  }

  const me = await mobileRequest<MeApiResponse>('/mobile/me', {
    accessToken: login.accessToken,
  });

  return {
    agentId: me.id,
    fullName: me.displayName,
    role: API_TO_MOBILE_ROLE[me.role] ?? AGENT_ROLES.AGENT_ENROLLMENT,
    establishmentId: me.establishmentId,
    establishmentName: me.establishmentName,
    deviceId: getMobileDeviceId(),
    accessToken: login.accessToken,
    refreshToken: login.refreshToken,
  };
}

export async function requestDeviceRegistrationWithApi(
  credentials: LoginCredentials,
): Promise<DeviceRegistrationResponse> {
  const identifier = credentials.identifier.trim();
  const password = credentials.password;

  if (!identifier || !password) {
    throw new MobileApiError(
      400,
      'VALIDATION_ERROR',
      'Identifiant et mot de passe obligatoires.',
    );
  }

  return mobileRequest<DeviceRegistrationResponse>(
    '/mobile/auth/device-registration-request',
    {
      method: 'POST',
      body: {
        identifier,
        password,
        ...getMobileDeviceMeta(),
      },
      skipAuthRetry: true,
    },
  );
}

export async function logoutWithApi(session: AgentSession): Promise<void> {
  if (!session.accessToken) return;
  try {
    await mobileRequest('/mobile/auth/logout', {
      method: 'POST',
      accessToken: session.accessToken,
      body: { refreshToken: session.refreshToken },
      skipAuthRetry: true,
    });
  } catch {
    // Local logout still proceeds if API is unreachable.
  }
}

export async function refreshWithApi(
  refreshToken: string,
): Promise<{ accessToken: string; refreshToken?: string }> {
  return mobileRequest('/mobile/auth/refresh', {
    method: 'POST',
    body: { refreshToken },
    skipAuthRetry: true,
  });
}
