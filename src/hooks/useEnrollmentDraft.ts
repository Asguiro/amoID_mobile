import { useEffect, useState } from 'react';
import {
  enrollmentDraftStore,
  type EnrollmentDraftState,
} from '../store/enrollment-draft.store';

export function useEnrollmentDraft(): EnrollmentDraftState {
  const [state, setState] = useState<EnrollmentDraftState>(
    enrollmentDraftStore.state,
  );

  useEffect(() => {
    const subscription = enrollmentDraftStore.subscribe(() => {
      setState(enrollmentDraftStore.state);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return state;
}
