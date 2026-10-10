/**
 * q-mp-373 mutation audit UI wave 12 — game-error-boundary kill / pin.
 * Structural / callback / testid asserts only — no player-facing crash copy.
 * Known-equivalent active/didCatch survivors remain pinned (wave-1 residue).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  installGameErrorBoundary,
  renderGameCrash,
} from '../../src/ui/game-error-boundary';

describe('mutation-ui12 game-error-boundary', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('renderGameCrash uses button type=button and action dataset keys', () => {
    const container = document.createElement('div');
    const onReset = vi.fn();
    const onHome = vi.fn();
    renderGameCrash(container, 'Hex', onReset, onHome);

    const wrap = container.querySelector('[data-testid="game-error-boundary"]');
    expect(wrap?.getAttribute('role')).toBe('alert');
    expect(wrap?.classList.contains('game-loading')).toBe(true);
    expect(wrap?.classList.contains('game-loading-error')).toBe(true);

    const reset = container.querySelector(
      '[data-action="reset"]'
    ) as HTMLButtonElement;
    const home = container.querySelector(
      '[data-action="home"]'
    ) as HTMLButtonElement;
    expect(reset.type).toBe('button');
    expect(home.type).toBe('button');
    expect(reset.classList.contains('btn-primary')).toBe(true);
    expect(home.classList.contains('btn-secondary')).toBe(true);
    reset.click();
    home.click();
    expect(onReset).toHaveBeenCalledOnce();
    expect(onHome).toHaveBeenCalledOnce();
  });

  it('resource errors without .error are skipped (kills L120 remove !)', () => {
    const container = document.createElement('div');
    const onBeforeShow = vi.fn();
    const handle = installGameErrorBoundary({
      gameName: 'Hex',
      container,
      onReset: vi.fn(),
      onHome: vi.fn(),
      onBeforeShow,
    });
    window.dispatchEvent(
      new ErrorEvent('error', {
        message: 'script load failed',
        cancelable: true,
      })
    );
    expect(handle.didCatch).toBe(false);
    expect(onBeforeShow).not.toHaveBeenCalled();
    expect(container.childNodes.length).toBe(0);
    handle.dispose();
  });

  it('first real error prevents default and stamps didCatch once', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const errSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    const onBeforeShow = vi.fn();
    const handle = installGameErrorBoundary({
      gameName: 'Hex',
      container,
      onReset: vi.fn(),
      onHome: vi.fn(),
      onBeforeShow,
    });

    const event = new ErrorEvent('error', {
      error: new Error('boom'),
      message: 'boom',
      cancelable: true,
    });
    const defaultAllowed = window.dispatchEvent(event);
    expect(defaultAllowed).toBe(false);
    expect(handle.didCatch).toBe(true);
    expect(onBeforeShow).toHaveBeenCalledOnce();
    expect(
      container.querySelector('[data-testid="game-error-boundary"]')
    ).not.toBeNull();

    errSpy.mockRestore();
    handle.dispose();
  });

  it('unhandledrejection shows crash UI and sets didCatch', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const errSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    const handle = installGameErrorBoundary({
      gameName: 'Hex',
      container,
      onReset: vi.fn(),
      onHome: vi.fn(),
    });
    window.dispatchEvent(
      new PromiseRejectionEvent('unhandledrejection', {
        promise: Promise.resolve(),
        reason: new Error('reject'),
      })
    );
    expect(handle.didCatch).toBe(true);
    expect(
      container.querySelector('[data-testid="game-error-boundary"]')
    ).not.toBeNull();
    errSpy.mockRestore();
    handle.dispose();
  });

  it('dispose before catch leaves didCatch false (kills L90 true→false init path)', () => {
    const container = document.createElement('div');
    const onBeforeShow = vi.fn();
    const handle = installGameErrorBoundary({
      gameName: 'Hex',
      container,
      onReset: vi.fn(),
      onHome: vi.fn(),
      onBeforeShow,
    });
    expect(handle.didCatch).toBe(false);
    handle.dispose();
    expect(handle.didCatch).toBe(false);
    expect(onBeforeShow).not.toHaveBeenCalled();
  });

  // Survivors L94 `!active || didCatch` → `&&`, L98/L145 `active = false` → `true`
  // are equivalent under the public API (listeners always removed with the flag).
  it.skip('PIN: active/didCatch boolean mutants are observationally equivalent', () => {
    // Reason: after show()/dispose(), removeListeners() runs unconditionally, so
    // flipping active false→true or ||→&& cannot be observed via window events.
  });
});
