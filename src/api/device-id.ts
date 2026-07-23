import * as Keychain from 'react-native-keychain';
import { Platform } from 'react-native';

declare const process: { env: Record<string, string | undefined> };

const SERVICE = 'amo-id-mobile-device-id';
const ENV_FALLBACK = process.env.EXPO_PUBLIC_DEVICE_ID;

let cachedDeviceId: string | null = null;

function createDeviceId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function hydrateMobileDeviceId(): Promise<string> {
  if (cachedDeviceId) return cachedDeviceId;

  if (ENV_FALLBACK?.trim()) {
    cachedDeviceId = ENV_FALLBACK.trim();
    return cachedDeviceId;
  }

  try {
    const existing = await Keychain.getGenericPassword({ service: SERVICE });
    if (existing && typeof existing !== 'boolean' && existing.password) {
      cachedDeviceId = existing.password;
      return cachedDeviceId;
    }
  } catch {
    // fall through to create
  }

  const next = `amo-${Platform.OS}-${createDeviceId()}`;
  try {
    await Keychain.setGenericPassword('device', next, { service: SERVICE });
  } catch {
    // keep in-memory if keychain write fails
  }
  cachedDeviceId = next;
  return next;
}

export function getMobileDeviceId(): string {
  return cachedDeviceId ?? ENV_FALLBACK?.trim() ?? 'unhydrated-device';
}

export function getMobilePlatform(): string {
  return Platform.OS === 'ios' ? 'ios' : 'android';
}
