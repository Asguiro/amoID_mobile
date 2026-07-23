import { useEffect, useState } from 'react';
import {
  logoutWithApi,
  mapAuthErrorCode,
} from '../api/services/auth.service';
import type { AgentSession } from '../api/types/agent.types';
import {
  clearSession,
  hydrateSession,
  sessionStore,
  setSession,
  type SessionState,
} from '../store/session.store';

export function useSession() {
  const [state, setState] = useState<SessionState>(sessionStore.state);

  useEffect(() => {
    const subscription = sessionStore.subscribe(() => {
      setState(sessionStore.state);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    session: state.session,
    isAuthenticated: state.isAuthenticated,
    isHydrated: state.isHydrated,
    pendingSyncCount: state.pendingSyncCount,
    isOffline: state.isOffline,
    deviceAccessStatus: state.deviceAccessStatus,
    deviceAccessCode: state.deviceAccessCode,
  };
}

export function useSessionActions() {
  const login = (nextSession: AgentSession) => {
    setSession(nextSession);
  };

  const logout = async () => {
    const current = sessionStore.state.session;
    if (current) {
      await logoutWithApi(current);
    }
    clearSession();
  };

  return { login, logout, mapAuthErrorCode, hydrateSession };
}
