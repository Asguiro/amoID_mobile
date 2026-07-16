export function toDisplayFileUri(filePath: string): string {
  if (filePath.startsWith('file://')) {
    return filePath;
  }

  return `file://${filePath}`;
}
