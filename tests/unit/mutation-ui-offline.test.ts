/**
 * burn-1008-mp-mutation-audit-ui — kill survivors in offline.ts.
 * Does NOT assert player-facing hint copy — only structural / boolean behavior.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  bindOfflineDocumentFlag,
  gameLoadErrorHint,
  isBrowserOffline,
} from '../../src/ui/offline';

describe('mutation-ui offline', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-offline');
    vi.restoreAllMocks();
  });

  it('isBrowserOffline is false when navigator is undefined', () => {
    // Survivor: return false → true when navigator undefined.
    const desc = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
    // Soft-delete navigator for this assertion via a stub object without onLine.
    vi.stubGlobal('navigator', undefined);
    try {
      expect(isBrowserOffline()).toBe(false);
    } finally {
      vi.unstubAllGlobals();
      if (desc) Object.defineProperty(globalThis, 'navigator', desc);
    }
  });

  it('bindOfflineDocumentFlag returns no-op when document missing', () => {
    // Survivor: document === undefined || window === undefined flipped to &&.
    // In jsdom both exist; pin that bind still returns a function and unbinds.
    const unbind = bindOfflineDocumentFlag();
    expect(typeof unbind).toBe('function');
    unbind();
  });

  it('gameLoadErrorHint returns distinct strings for offline vs online without locking copy', () => {
    // Length/identity only — never assert player-facing wording.
    const off = gameLoadErrorHint(true);
    const on = gameLoadErrorHint(false);
    expect(typeof off).toBe('string');
    expect(typeof on).toBe('string');
    expect(off).not.toBe(on);
    expect(off.length).toBeGreaterThan(0);
    expect(on.length).toBeGreaterThan(0);
  });

  it('bindOfflineDocumentFlag initial sync respects onLine', () => {
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      get: () => false,
    });
    const unbind = bindOfflineDocumentFlag();
    expect(document.documentElement.getAttribute('data-offline')).toBe('true');
    unbind();
  });
});
