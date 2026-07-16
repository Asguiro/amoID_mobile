import { useEffect, useState } from 'react';
import {
  clearSession,
  sessionStore,
  setSession,
  type SessionState,
} from '../store/session.store';
import type { AgentSession } from '../api/types/agent.types';

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
    pendingSyncCount: state.pendingSyncCount,
    isOffline: state.isOffline,
  };
}

export function useSessionActions() {
  const login = (nextSession: AgentSession) => {
    setSession(nextSession);
  };

  const logout = () => {
    clearSession();
  };

  return { login, logout };
}
