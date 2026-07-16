import { useCallback } from 'react';
import { translate } from '../i18n';

type InterpolationValues = Record<string, string | number>;

export function useTranslation() {
  const t = useCallback((key: string, values?: InterpolationValues) => {
    return translate(key, values);
  }, []);

  return { t };
}
