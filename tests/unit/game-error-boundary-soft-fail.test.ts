/**
 * q-mp-257 — characterize game-error-boundary soft-fail / recover paths.
 * Structural asserts only (classList, testids, callbacks, console breadcrumb).
 * No player-facing copy pins.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  installGameErrorBoundary,
  renderGameCrash,
} from '../../src/ui/game-error-boundary';

describe('q-mp-257 game-error-boundary soft-fail paths', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('renderGameCrash exposes structural crash shell (classes / role / actions)', () => {
    const root = document.createElement('div');
    const onReset = vi.fn();
    const onHome = vi.fn();
    renderGameCrash(root, 'Hex', onReset, onHome);

    const wrap = root.querySelector('[data-testid="game-error-boundary"]');
    expect(wrap).toBeInstanceOf(HTMLElement);
    expect(wrap?.classList.contains('game-loading')).toBe(true);
    expect(wrap?.classList.contains('game-loading-error')).toBe(true);
    expect(wrap?.getAttribute('role')).toBe('alert');

    expect(
      root.querySelector('[data-testid="game-error-boundary-hint"]')
    ).not.toBeNull();
    expect(root.querySelector('.game-loading-text')).not.toBeNull();
    expect(root.querySelector('.game-loading-actions')).not.toBeNull();

    const reset = root.querySelector(
      '[data-action="reset"]'
    ) as HTMLButtonElement | null;
    const home = root.querySelector(
      '[data-action="home"]'
    ) as HTMLButtonElement | null;
    expect(reset?.type).toBe('button');
    expect(home?.type).toBe('button');
    expect(reset?.classList.contains('btn')).toBe(true);
    expect(reset?.classList.contains('btn-primary')).toBe(true);
    expect(home?.classList.contains('btn')).toBe(true);
    expect(home?.classList.contains('btn-secondary')).toBe(true);

    reset?.click();
    home?.click();
    expect(onReset).toHaveBeenCalledOnce();
    expect(onHome).toHaveBeenCalledOnce();
  });

  it('soft-fail catch logs console.error breadcrumb then shows crash UI once', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    root.appendChild(document.createElement('span')).dataset.prior = '1';

    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const onBeforeShow = vi.fn();
    const onReset = vi.fn();
    const onHome = vi.fn();
    const boom = new Error('soft-fail boom');

    const handle = installGameErrorBoundary({
      gameName: 'Calla',
      container: root,
      onReset,
      onHome,
      onBeforeShow,
    });

    const event = new ErrorEvent('error', {
      error: boom,
      message: 'soft-fail boom',
      cancelable: true,
    });
    const prevented = window.dispatchEvent(event);

    expect(prevented).toBe(false);
    expect(onBeforeShow).toHaveBeenCalledOnce();
    expect(errSpy).toHaveBeenCalledOnce();
    expect(errSpy.mock.calls[0]?.[0]).toBe('[game-error-boundary] Calla');
    expect(errSpy.mock.calls[0]?.[1]).toBe(boom);

    // Listeners torn down on first catch — no second soft-fail entry (do not
    // re-dispatch ErrorEvents with .error; jsdom would treat them as uncaught).
    expect(removeSpy).toHaveBeenCalledWith('error', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith(
      'unhandledrejection',
      expect.any(Function)
    );

    expect(root.querySelector('[data-prior]')).toBeNull();
    const wrap = root.querySelector('[data-testid="game-error-boundary"]');
    expect(wrap?.classList.contains('game-loading-error')).toBe(true);
    expect(handle.didCatch).toBe(true);
    expect(
      root.querySelectorAll('[data-testid="game-error-boundary"]').length
    ).toBe(1);

    // Recover path: actions wired after soft-fail show().
    root.querySelector<HTMLButtonElement>('[data-action="reset"]')?.click();
    root.querySelector<HTMLButtonElement>('[data-action="home"]')?.click();
    expect(onReset).toHaveBeenCalledOnce();
    expect(onHome).toHaveBeenCalledOnce();

    handle.dispose();
  });

  it('unhandledrejection soft-fail: preventDefault + non-Error reason still recovers', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const onReset = vi.fn();

    const handle = installGameErrorBoundary({
      gameName: 'FIAR',
      container: root,
      onReset,
      onHome: vi.fn(),
    });

    const reason = 'string-reject-reason';
    const event = new PromiseRejectionEvent('unhandledrejection', {
      promise: Promise.resolve(),
      reason,
      cancelable: true,
    });
    expect(window.dispatchEvent(event)).toBe(false);

    expect(errSpy).toHaveBeenCalledOnce();
    expect(errSpy.mock.calls[0]?.[0]).toBe('[game-error-boundary] FIAR');
    expect(errSpy.mock.calls[0]?.[1]).toBe(reason);
    expect(handle.didCatch).toBe(true);
    expect(
      root
        .querySelector('[data-testid="game-error-boundary"]')
        ?.classList.contains('game-loading')
    ).toBe(true);

    root.querySelector<HTMLButtonElement>('[data-action="reset"]')?.click();
    expect(onReset).toHaveBeenCalledOnce();

    handle.dispose();
  });

  it('dispose soft-fails closed: listeners removed; container untouched', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const marker = document.createElement('div');
    marker.dataset.keep = 'yes';
    root.appendChild(marker);

    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const onBeforeShow = vi.fn();
    const handle = installGameErrorBoundary({
      gameName: 'Hex',
      container: root,
      onReset: vi.fn(),
      onHome: vi.fn(),
      onBeforeShow,
    });

    handle.dispose();
    expect(handle.didCatch).toBe(false);
    expect(removeSpy).toHaveBeenCalledWith('error', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith(
      'unhandledrejection',
      expect.any(Function)
    );

    // Safe no-op probe (resource ErrorEvent has no .error) — proves dispose did
    // not leave a catching handler that would call onBeforeShow / console.error.
    window.dispatchEvent(
      new ErrorEvent('error', { message: 'img fail after dispose' })
    );

    expect(onBeforeShow).not.toHaveBeenCalled();
    expect(errSpy).not.toHaveBeenCalled();
    expect(handle.didCatch).toBe(false);
    expect(root.querySelector('[data-keep="yes"]')).not.toBeNull();
    expect(root.querySelector('[data-testid="game-error-boundary"]')).toBeNull();
  });

  it('omitted onBeforeShow still soft-fails to crash UI (optional callback)', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const handle = installGameErrorBoundary({
      gameName: 'Juggle',
      container: root,
      onReset: vi.fn(),
      onHome: vi.fn(),
    });

    window.dispatchEvent(
      new ErrorEvent('error', {
        error: new Error('no-before'),
        message: 'no-before',
      })
    );

    expect(handle.didCatch).toBe(true);
    expect(errSpy).toHaveBeenCalledOnce();
    expect(
      root
        .querySelector('[data-testid="game-error-boundary"]')
        ?.classList.contains('game-loading-error')
    ).toBe(true);

    handle.dispose();
  });

  it('resource ErrorEvent without .error stays a no-op soft skip', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const prior = document.createElement('p');
    prior.dataset.keep = '1';
    root.appendChild(prior);

    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const onBeforeShow = vi.fn();
    const handle = installGameErrorBoundary({
      gameName: 'Hex',
      container: root,
      onReset: vi.fn(),
      onHome: vi.fn(),
      onBeforeShow,
    });

    const event = new ErrorEvent('error', {
      message: 'script/img load',
      cancelable: true,
    });
    expect(window.dispatchEvent(event)).toBe(true);
    expect(onBeforeShow).not.toHaveBeenCalled();
    expect(errSpy).not.toHaveBeenCalled();
    expect(handle.didCatch).toBe(false);
    expect(root.querySelector('[data-keep="1"]')).not.toBeNull();
    expect(root.querySelector('[data-testid="game-error-boundary"]')).toBeNull();

    handle.dispose();
  });
});
