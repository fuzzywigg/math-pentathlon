import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  bindOfflineDocumentFlag,
  gameLoadErrorHint,
  isBrowserOffline,
} from '../../src/ui/offline';

describe('offline helpers', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-offline');
    vi.restoreAllMocks();
  });

  it('gameLoadErrorHint explains offline vs connection', () => {
    expect(gameLoadErrorHint(true)).toMatch(/offline/i);
    expect(gameLoadErrorHint(false)).toMatch(/connection/i);
  });

  it('isBrowserOffline follows navigator.onLine', () => {
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

  it('bindOfflineDocumentFlag syncs html data-offline', () => {
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
  });
});
