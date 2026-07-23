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

type AndroidPlatformConstants = {
  Brand?: string;
  Model?: string;
  Manufacturer?: string;
  Release?: string;
};

type IosPlatformConstants = {
  systemName?: string;
  osVersion?: string;
};

/** Métadonnées matérielles pour l’enregistrement / la supervision. */
export function getMobileDeviceMeta(): {
  platform: string;
  brand?: string;
  model?: string;
  manufacturer?: string;
  osVersion?: string;
  label?: string;
} {
  const platform = getMobilePlatform();
  const constants = Platform.constants as
    | AndroidPlatformConstants
    | IosPlatformConstants
    | undefined;

  if (platform === 'ios') {
    const ios = constants as IosPlatformConstants | undefined;
    const osVersion =
      ios?.osVersion ??
      (typeof Platform.Version === 'string'
        ? Platform.Version
        : String(Platform.Version));
    return {
      platform,
      brand: 'Apple',
      manufacturer: 'Apple',
      model: ios?.systemName === 'iPadOS' ? 'iPad' : 'iPhone',
      osVersion,
      label: `Apple ${ios?.systemName === 'iPadOS' ? 'iPad' : 'iPhone'}`,
    };
  }

  const android = constants as AndroidPlatformConstants | undefined;
  const brand = android?.Brand?.trim() || undefined;
  const model = android?.Model?.trim() || undefined;
  const manufacturer = android?.Manufacturer?.trim() || undefined;
  const osVersion =
    android?.Release?.trim() ||
    (typeof Platform.Version === 'number'
      ? String(Platform.Version)
      : String(Platform.Version));
  const hardwareLabel = [brand, model].filter(Boolean).join(' ').trim();

  return {
    platform,
    brand,
    model,
    manufacturer,
    osVersion,
    label: hardwareLabel || undefined,
  };
}
