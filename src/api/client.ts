const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'https://amo-id-api.onrender.com';
const DEVICE_ID =
  process.env.EXPO_PUBLIC_DEVICE_ID ?? 'seed-device-enrollment-01';

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

export function getMobileDeviceId() {
  return DEVICE_ID;
}

export async function mobileRequest<T>(
  path: string,
  options: {
    method?: string;
    body?: unknown;
    accessToken?: string;
    deviceId?: string;
  } = {},
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'x-device-id': options.deviceId ?? DEVICE_ID,
  };

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (options.accessToken) {
    headers.Authorization = `Bearer ${options.accessToken}`;
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
    throw new MobileApiError(response.status, code, message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
