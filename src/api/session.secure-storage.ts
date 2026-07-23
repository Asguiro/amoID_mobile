import * as Keychain from 'react-native-keychain';
import type { AgentSession } from './types/agent.types';

const SERVICE = 'amo-id-mobile-session';

export async function saveSessionSecure(
  session: AgentSession,
): Promise<void> {
  await Keychain.setGenericPassword(
    'session',
    JSON.stringify(session),
    { service: SERVICE },
  );
}

export async function loadSessionSecure(): Promise<AgentSession | null> {
  try {
    const credentials = await Keychain.getGenericPassword({ service: SERVICE });
    if (!credentials) return null;
    return JSON.parse(credentials.password) as AgentSession;
  } catch {
    return null;
  }
}

export async function clearSessionSecure(): Promise<void> {
  try {
    await Keychain.resetGenericPassword({ service: SERVICE });
  } catch {
    // ignore
  }
}
