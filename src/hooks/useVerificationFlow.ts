import { useEffect, useState } from 'react';
import {
  verificationFlowStore,
  type VerificationFlowState,
} from '../store/verification-flow.store';

export function useVerificationFlow(): VerificationFlowState {
  const [state, setState] = useState<VerificationFlowState>(
    verificationFlowStore.state,
  );

  useEffect(() => {
    const subscription = verificationFlowStore.subscribe(() => {
      setState(verificationFlowStore.state);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return state;
}
