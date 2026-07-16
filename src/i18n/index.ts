import { fr, type TranslationTree } from './fr';

type InterpolationValues = Record<string, string | number>;

function getNestedValue(tree: TranslationTree, path: string): string | undefined {
  const segments = path.split('.');
  let current: unknown = tree;

  for (const segment of segments) {
    if (typeof current !== 'object' || current === null || !(segment in current)) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[segment];
  }

  return typeof current === 'string' ? current : undefined;
}

function interpolate(template: string, values?: InterpolationValues): string {
  if (!values) {
    return template;
  }

  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = values[key];
    return value === undefined ? '' : String(value);
  });
}

export function translate(
  key: string,
  values?: InterpolationValues,
): string {
  const template = getNestedValue(fr, key);

  if (!template) {
    return key;
  }

  return interpolate(template, values);
}

export { fr };
