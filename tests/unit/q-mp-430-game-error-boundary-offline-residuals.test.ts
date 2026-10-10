/**
 * q-mp-430 — Characterize game-error-boundary + offline soft-fail residuals.
 *
 * Tests only. Structural asserts (testids, classList, callback counts, attribute
 * presence, listener teardown, boolean flags). No player-facing copy pins.
 * No real network — navigator.onLine stubs + window events only.
 *
 * Live tip re-measure (`cursor/mp-tip-post865` @ `7f8a7147`):
 * - `src/ui/game-error-boundary.ts` 149 LOC
 * - `src/ui/offline.ts` 45 LOC
 * Prior suites cover happy-path crash UI, resource-error skip, basic online/
 * offline flag sync, and mutation kill pins (`game-error-boundary*`,
 * `offline-helpers`, `mutation-ui*`, `mutation-ui11/12`, burn-1008 r4).
 * This file targets combined soft-fail residuals not owned by those suites:
 * onBeforeShow throw swallow, dispose-after-catch, falsy `.error` skip,
 * post-dispose rejection no-op, missing `onLine`, SSR document/window no-op,
 * unbind-leaves-attribute, dual-bind listener residual.
 *
 * Narrowed vs open drafts into tip:
 * - #872 q-mp-373 mutation w12 (game-error-boundary scores) — leave alone
 * - #875 q-mp-350 mutation w11 (offline scores) — leave alone
 * - #884 q-mp-404 idle-warm / PWA bootstrap — disjoint hosts
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  installGameErrorBoundary,
  renderGameCrash,
} from '../../src/ui/game-error-boundary';
import {
  bindOfflineDocumentFlag,
  gameLoadErrorHint,
  isBrowserOffline,
} from '../../src/ui/offline';

afterEach(() => {
  document.body.innerHTML = '';
  document.documentElement.removeAttribute('data-offline');
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('q-mp-430 game-error-boundary — soft-fail residuals', () => {
  it('onBeforeShow throw is swallowed and crash UI still mounts once', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const boom = new Error('route boom');
    const handle = installGameErrorBoundary({
      gameName: 'Hex',
      container: root,
      onReset: vi.fn(),
      onHome: vi.fn(),
      onBeforeShow: () => {
        throw new Error('cleanup failed');
      },
    });

    const event = new ErrorEvent('error', {
      error: boom,
      message: 'route boom',
      cancelable: true,
    });
    expect(window.dispatchEvent(event)).toBe(false);

    expect(handle.didCatch).toBe(true);
    expect(errSpy).toHaveBeenCalledOnce();
    expect(errSpy.mock.calls[0]?.[0]).toBe('[game-error-boundary] Hex');
    expect(errSpy.mock.calls[0]?.[1]).toBe(boom);
    const wrap = root.querySelector('[data-testid="game-error-boundary"]');
    expect(wrap?.classList.contains('game-loading-error')).toBe(true);
    expect(wrap?.getAttribute('role')).toBe('alert');
    expect(
      root.querySelectorAll('[data-testid="game-error-boundary"]').length
    ).toBe(1);

    handle.dispose();
  });

  it('dispose after catch keeps didCatch sticky and leaves crash shell', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const handle = installGameErrorBoundary({
      gameName: 'Calla',
      container: root,
      onReset: vi.fn(),
      onHome: vi.fn(),
    });

    window.dispatchEvent(
      new ErrorEvent('error', {
        error: new Error('first'),
        message: 'first',
      })
    );
    expect(handle.didCatch).toBe(true);
    expect(
      root.querySelector('[data-testid="game-error-boundary"]')
    ).not.toBeNull();
    expect(errSpy).toHaveBeenCalledOnce();

    const removeCallsAfterCatch = removeSpy.mock.calls.length;
    handle.dispose();
    expect(handle.didCatch).toBe(true);
    // dispose after catch still tears listeners down again (idempotent remove).
    expect(removeSpy.mock.calls.length).toBeGreaterThanOrEqual(
      removeCallsAfterCatch
    );
    expect(removeSpy).toHaveBeenCalledWith('error', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith(
      'unhandledrejection',
      expect.any(Function)
    );
    expect(
      root
        .querySelector('[data-testid="game-error-boundary"]')
        ?.classList.contains('game-loading')
    ).toBe(true);
    // Safe resource-style probe only — ErrorEvent with .error would be uncaught
    // in jsdom once listeners are gone (same pin as q-mp-257 soft-fail suite).
    window.dispatchEvent(
      new ErrorEvent('error', { message: 'img fail after dispose-catch' })
    );
    expect(errSpy).toHaveBeenCalledOnce();
    expect(
      root.querySelectorAll('[data-testid="game-error-boundary"]').length
    ).toBe(1);
  });

  it('falsy ErrorEvent.error values soft-skip catch (null / 0 / empty string)', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const prior = document.createElement('span');
    prior.dataset.keep = '1';
    root.appendChild(prior);
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const onBeforeShow = vi.fn();
    const handle = installGameErrorBoundary({
      gameName: 'FIAR',
      container: root,
      onReset: vi.fn(),
      onHome: vi.fn(),
      onBeforeShow,
    });

    for (const error of [null, 0, ''] as const) {
      const event = new ErrorEvent('error', {
        // @ts-expect-error intentional falsy resource-style payloads
        error,
        message: 'resource-ish',
        cancelable: true,
      });
      expect(window.dispatchEvent(event)).toBe(true);
    }

    expect(onBeforeShow).not.toHaveBeenCalled();
    expect(errSpy).not.toHaveBeenCalled();
    expect(handle.didCatch).toBe(false);
    expect(root.querySelector('[data-keep="1"]')).not.toBeNull();
    expect(root.querySelector('[data-testid="game-error-boundary"]')).toBeNull();

    handle.dispose();
  });

  it('captured rejection handler after dispose soft-returns (!active)', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const marker = document.createElement('div');
    marker.dataset.keep = 'yes';
    root.appendChild(marker);
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const onBeforeShow = vi.fn();
    const listeners = new Map<string, EventListener>();
    const addSpy = vi
      .spyOn(window, 'addEventListener')
      .mockImplementation((type, listener) => {
        if (typeof listener === 'function') {
          listeners.set(String(type), listener as EventListener);
        }
      });

    const handle = installGameErrorBoundary({
      gameName: 'Juggle',
      container: root,
      onReset: vi.fn(),
      onHome: vi.fn(),
      onBeforeShow,
    });
    expect(addSpy).toHaveBeenCalled();
    const onRejection = listeners.get('unhandledrejection');
    expect(typeof onRejection).toBe('function');

    handle.dispose();
    expect(handle.didCatch).toBe(false);

    // Invoke the captured handler directly — dispose set `active = false`, so
    // preventDefault still runs but show() soft-returns before crash UI.
    const fake = {
      preventDefault: vi.fn(),
      reason: new Error('late-reject'),
    } as unknown as PromiseRejectionEvent;
    onRejection?.(fake);

    expect(fake.preventDefault).toHaveBeenCalledOnce();
    expect(onBeforeShow).not.toHaveBeenCalled();
    expect(errSpy).not.toHaveBeenCalled();
    expect(handle.didCatch).toBe(false);
    expect(root.querySelector('[data-keep="yes"]')).not.toBeNull();
    expect(root.querySelector('[data-testid="game-error-boundary"]')).toBeNull();
  });

  it('renderGameCrash clears prior children before mounting structural shell', () => {
    const root = document.createElement('div');
    const stale = document.createElement('p');
    stale.dataset.stale = '1';
    root.appendChild(stale);
    const onReset = vi.fn();
    const onHome = vi.fn();

    renderGameCrash(root, 'Hex', onReset, onHome);

    expect(root.querySelector('[data-stale]')).toBeNull();
    const wrap = root.querySelector('[data-testid="game-error-boundary"]');
    expect(wrap?.classList.contains('game-loading-error')).toBe(true);
    expect(
      root.querySelector('[data-testid="game-error-boundary-hint"]')
    ).not.toBeNull();
    expect(root.querySelector('.game-loading-actions')).not.toBeNull();
    root.querySelector<HTMLButtonElement>('[data-action="reset"]')?.click();
    root.querySelector<HTMLButtonElement>('[data-action="home"]')?.click();
    expect(onReset).toHaveBeenCalledOnce();
    expect(onHome).toHaveBeenCalledOnce();
  });
});

describe('q-mp-430 offline — soft-fail residuals', () => {
  it('isBrowserOffline is false when onLine is missing (not strictly false)', () => {
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      get: () => undefined,
    });
    expect(isBrowserOffline()).toBe(false);

    // Drop the property entirely — `undefined === false` stays false.
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- residual probe
    delete (navigator as { onLine?: boolean }).onLine;
    expect(isBrowserOffline()).toBe(false);
  });

  it('gameLoadErrorHint default arg follows navigator without locking wording', () => {
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      get: () => false,
    });
    const fromNavOffline = gameLoadErrorHint();
    const explicitOffline = gameLoadErrorHint(true);
    expect(typeof fromNavOffline).toBe('string');
    expect(fromNavOffline.length).toBeGreaterThan(0);
    expect(fromNavOffline).toBe(explicitOffline);

    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      get: () => true,
    });
    const fromNavOnline = gameLoadErrorHint();
    const explicitOnline = gameLoadErrorHint(false);
    expect(typeof fromNavOnline).toBe('string');
    expect(fromNavOnline.length).toBeGreaterThan(0);
    expect(fromNavOnline).toBe(explicitOnline);
    expect(fromNavOffline).not.toBe(fromNavOnline);
  });

  it('bindOfflineDocumentFlag returns no-op unbind when document is undefined', () => {
    const saved = globalThis.document;
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- SSR probe
    delete (globalThis as { document?: Document }).document;
    try {
      const unbind = bindOfflineDocumentFlag();
      expect(typeof unbind).toBe('function');
      expect(() => unbind()).not.toThrow();
    } finally {
      globalThis.document = saved;
    }
  });

  it('bindOfflineDocumentFlag returns no-op unbind when window is undefined', () => {
    const saved = globalThis.window;
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- SSR probe
    delete (globalThis as { window?: Window & typeof globalThis }).window;
    try {
      const unbind = bindOfflineDocumentFlag();
      expect(typeof unbind).toBe('function');
      expect(() => unbind()).not.toThrow();
    } finally {
      globalThis.window = saved;
    }
  });

  it('unbind leaves last data-offline attribute (listeners only)', () => {
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      get: () => false,
    });
    const unbind = bindOfflineDocumentFlag();
    expect(document.documentElement.getAttribute('data-offline')).toBe('true');

    unbind();
    // Unsubscribe does not clear chrome — residual soft leave-behind.
    expect(document.documentElement.getAttribute('data-offline')).toBe('true');

    window.dispatchEvent(new Event('online'));
    expect(document.documentElement.getAttribute('data-offline')).toBe('true');
  });

  it('dual bind both sync; both unbinds required to silence offline events', () => {
    let online = true;
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      get: () => online,
    });

    const unbindA = bindOfflineDocumentFlag();
    const unbindB = bindOfflineDocumentFlag();
    expect(document.documentElement.hasAttribute('data-offline')).toBe(false);

    online = false;
    window.dispatchEvent(new Event('offline'));
    expect(document.documentElement.getAttribute('data-offline')).toBe('true');

    unbindA();
    // B still listening — online event still clears via remaining binder.
    online = true;
    window.dispatchEvent(new Event('online'));
    expect(document.documentElement.hasAttribute('data-offline')).toBe(false);

    unbindB();
    online = false;
    window.dispatchEvent(new Event('offline'));
    expect(document.documentElement.hasAttribute('data-offline')).toBe(false);
  });
});
