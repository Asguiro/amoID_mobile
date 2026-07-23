import { Store } from '@tanstack/store';
import type { AgentSession } from '../api/types/agent.types';
import {
  clearSessionSecure,
  loadSessionSecure,
  saveSessionSecure,
} from '../api/session.secure-storage';

export interface SessionState {
  session: AgentSession | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  pendingSyncCount: number;
  isOffline: boolean;
}

const initialState: SessionState = {
  session: null,
  isAuthenticated: false,
  isHydrated: false,
  pendingSyncCount: 0,
  isOffline: false,
};

export const sessionStore = new Store<SessionState>(initialState);

export function setSession(session: AgentSession): void {
  sessionStore.setState(state => ({
    ...state,
    session,
    isAuthenticated: true,
  }));
  void saveSessionSecure(session);
}

export function patchSessionTokens(tokens: {
  accessToken: string;
  refreshToken?: string;
}): void {
  const current = sessionStore.state.session;
  if (!current) return;
  const next: AgentSession = {
    ...current,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken ?? current.refreshToken,
  };
  sessionStore.setState(state => ({
    ...state,
    session: next,
  }));
  void saveSessionSecure(next);
}

export function clearSession(): void {
  sessionStore.setState(state => ({
    ...state,
    session: null,
    isAuthenticated: false,
    pendingSyncCount: 0,
  }));
  void clearSessionSecure();
}

export function markHydrated(): void {
  sessionStore.setState(state => ({
    ...state,
    isHydrated: true,
  }));
}

export async function hydrateSession(): Promise<void> {
  const stored = await loadSessionSecure();
  if (stored?.accessToken) {
    sessionStore.setState(state => ({
      ...state,
      session: stored,
      isAuthenticated: true,
      isHydrated: true,
    }));
    return;
  }
  sessionStore.setState(state => ({
    ...state,
    session: null,
    isAuthenticated: false,
    isHydrated: true,
  }));
}

export function setOfflineStatus(isOffline: boolean): void {
  sessionStore.setState(state => ({
    ...state,
    isOffline,
  }));
}

export function setPendingSyncCount(count: number): void {
  sessionStore.setState(state => ({
    ...state,
    pendingSyncCount: count,
  }));
}

export function getAccessToken(): string | undefined {
  return sessionStore.state.session?.accessToken;
}

export function getRefreshToken(): string | undefined {
  return sessionStore.state.session?.refreshToken;
}
