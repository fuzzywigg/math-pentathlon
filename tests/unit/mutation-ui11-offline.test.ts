/**
 * q-mp-350 mutation audit UI wave 11 — structural re-pins for offline.
 * First-window already 100% at baseline; keep equality / boolean / event arms pinned.
 * No player-facing copy assertions (length / identity / attribute only).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  bindOfflineDocumentFlag,
  gameLoadErrorHint,
  isBrowserOffline,
} from '../../src/ui/offline';

describe('mutation-ui11 offline', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-offline');
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('isBrowserOffline false when navigator missing (kills L8 false→true)', () => {
    vi.stubGlobal('navigator', undefined);
    expect(isBrowserOffline()).toBe(false);
  });

  it('isBrowserOffline true only when onLine === false (not missing)', () => {
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      get: () => false,
    });
    expect(isBrowserOffline()).toBe(true);
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      get: () => true,
    });
    expect(isBrowserOffline()).toBe(false);
  });

  it('gameLoadErrorHint offline/online branches are distinct non-empty strings', () => {
    const off = gameLoadErrorHint(true);
    const on = gameLoadErrorHint(false);
    expect(typeof off).toBe('string');
    expect(typeof on).toBe('string');
    expect(off.length).toBeGreaterThan(0);
    expect(on.length).toBeGreaterThan(0);
    expect(off).not.toBe(on);
    // Default arg path still returns a string without locking wording.
    expect(typeof gameLoadErrorHint()).toBe('string');
  });

  it('bindOfflineDocumentFlag initial sync + offline/online events toggle attribute', () => {
    let online = true;
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      get: () => online,
    });
    const unbind = bindOfflineDocumentFlag();
    expect(document.documentElement.hasAttribute('data-offline')).toBe(false);

    online = false;
    window.dispatchEvent(new Event('offline'));
    expect(document.documentElement.getAttribute('data-offline')).toBe('true');

    online = true;
    window.dispatchEvent(new Event('online'));
    expect(document.documentElement.hasAttribute('data-offline')).toBe(false);

    unbind();
    online = false;
    window.dispatchEvent(new Event('offline'));
    // Unsubscribed — attribute must stay cleared.
    expect(document.documentElement.hasAttribute('data-offline')).toBe(false);
  });

  it('bindOfflineDocumentFlag returns a callable unbind when globals exist', () => {
    const unbind = bindOfflineDocumentFlag();
    expect(typeof unbind).toBe('function');
    unbind();
  });
});
