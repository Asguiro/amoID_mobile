import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  patchSessionTokens,
  setDeviceAccessStatus,
  type DeviceAccessStatus,
} from '../store/session.store';
import { getMobileDeviceId } from './device-id';

declare const process: { env: Record<string, string | undefined> };

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'https://amo-id-api.onrender.com';

const SESSION_KILL_CODES = new Set([
  'DEVICE_REVOKED',
  'DEVICE_UNKNOWN',
  'DEVICE_PENDING',
  'AGENT_SUSPENDED',
]);

export class MobileApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = 'MobileApiError';
    this.status = status;
    this.code = code;
  }
}

export { getMobileDeviceId } from './device-id';

export function getApiBaseUrl() {
  return API_URL;
}

function deviceAccessFromCode(code: string): DeviceAccessStatus | null {
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

let refreshInFlight: Promise<boolean> | null = null;

async function tryRefreshAccessToken(): Promise<boolean> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${API_URL}/mobile/auth/refresh`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-device-id': getMobileDeviceId(),
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) return false;

      const payload = (await response.json()) as {
        accessToken?: string;
        refreshToken?: string;
      };
      if (!payload.accessToken) return false;

      patchSessionTokens({
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
      });
      return true;
    } catch {
      return false;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

export async function mobileRequest<T>(
  path: string,
  options: {
    method?: string;
    body?: unknown;
    accessToken?: string;
    deviceId?: string;
    skipAuthRetry?: boolean;
  } = {},
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'x-device-id': options.deviceId ?? getMobileDeviceId(),
  };

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const token = options.accessToken ?? getAccessToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body:
      options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (!response.ok) {
    let message = response.statusText || 'Erreur API';
    let code = `HTTP_${response.status}`;
    try {
      const payload = (await response.json()) as {
        message?: string;
        code?: string;
      };
      message = payload.message ?? message;
      code = payload.code ?? code;
    } catch {
      // ignore
    }

    if (SESSION_KILL_CODES.has(code)) {
      const access = deviceAccessFromCode(code);
      if (access) setDeviceAccessStatus(access, code);
      clearSession();
      throw new MobileApiError(response.status, code, message);
    }

    const canRetry =
      response.status === 401 &&
      !options.skipAuthRetry &&
      !path.includes('/auth/login') &&
      !path.includes('/auth/refresh') &&
      !path.includes('/auth/device-registration-request');

    if (canRetry) {
      const refreshed = await tryRefreshAccessToken();
      if (refreshed) {
        return mobileRequest<T>(path, { ...options, skipAuthRetry: true });
      }
      clearSession();
    }

    throw new MobileApiError(response.status, code, message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
