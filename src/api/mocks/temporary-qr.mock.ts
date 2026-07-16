import type { TemporaryQrToken } from '../types/temporary-qr.types';

const issuedTokens = new Map<string, TemporaryQrToken>();

export function registerTemporaryQrToken(token: TemporaryQrToken): void {
  issuedTokens.set(token.qrValue, token);
}

export function findTemporaryQrToken(qrValue: string): TemporaryQrToken | undefined {
  const normalized = qrValue.trim();
  const token = issuedTokens.get(normalized);

  if (!token) {
    return undefined;
  }

  if (new Date(token.expiresAt).getTime() <= Date.now()) {
    return undefined;
  }

  return token;
}

export function listTemporaryQrTokens(): TemporaryQrToken[] {
  return Array.from(issuedTokens.values());
}
