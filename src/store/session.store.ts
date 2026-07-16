import { Store } from '@tanstack/store';
import type { AgentSession } from '../api/types/agent.types';

export interface SessionState {
  session: AgentSession | null;
  isAuthenticated: boolean;
  pendingSyncCount: number;
  isOffline: boolean;
}

const initialState: SessionState = {
  session: null,
  isAuthenticated: false,
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
}

export function clearSession(): void {
  sessionStore.setState(state => ({
    ...state,
    session: null,
    isAuthenticated: false,
    pendingSyncCount: 0,
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
