/**
 * burn-1008-mp-mutation-audit-ui — kill survivors in game-error-boundary.ts.
 * Asserts structure / callbacks only — not player-facing crash copy.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  installGameErrorBoundary,
  renderGameCrash,
} from '../../src/ui/game-error-boundary';

describe('mutation-ui game-error-boundary', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renderGameCrash builds reset/home actions without parsing gameName as HTML', () => {
    const container = document.createElement('div');
    const onReset = vi.fn();
    const onHome = vi.fn();
    renderGameCrash(container, '<img>', onReset, onHome);
    expect(container.querySelector('img')).toBeNull();
    expect(
      container.querySelector('[data-testid="game-error-boundary"]')
    ).not.toBeNull();
    const reset = container.querySelector(
      '[data-action="reset"]'
    ) as HTMLButtonElement;
    const home = container.querySelector(
      '[data-action="home"]'
    ) as HTMLButtonElement;
    reset.click();
    home.click();
    expect(onReset).toHaveBeenCalledOnce();
    expect(onHome).toHaveBeenCalledOnce();
  });

  it('didCatch stays true after first caught error', () => {
    // Reachable didCatch / active gating; listeners are removed after first catch
    // so a second window error is not re-handled (would be uncaught in jsdom).
    const container = document.createElement('div');
    document.body.appendChild(container);
    const onBeforeShow = vi.fn();
    const handle = installGameErrorBoundary({
      gameName: 'Hex',
      container,
      onReset: vi.fn(),
      onHome: vi.fn(),
      onBeforeShow,
    });
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    window.dispatchEvent(
      new ErrorEvent('error', { error: new Error('first'), message: 'first' })
    );
    expect(handle.didCatch).toBe(true);
    expect(onBeforeShow).toHaveBeenCalledOnce();
    expect(
      container.querySelector('[data-testid="game-error-boundary"]')
    ).not.toBeNull();
    errSpy.mockRestore();
    handle.dispose();
    container.remove();
  });

  it('dispose before any error leaves didCatch false and empty container', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const onBeforeShow = vi.fn();
    const handle = installGameErrorBoundary({
      gameName: 'Hex',
      container,
      onReset: vi.fn(),
      onHome: vi.fn(),
      onBeforeShow,
    });
    handle.dispose();
    expect(handle.didCatch).toBe(false);
    expect(onBeforeShow).not.toHaveBeenCalled();
    expect(container.childNodes.length).toBe(0);
    container.remove();
  });

  // Survivors L94 `!active || didCatch` → `&&`, L96/L141 `active = false` → `true`
  // are equivalent under the public API (listeners always removed with the flag).
  it.skip('PIN: active/didCatch boolean mutants are observationally equivalent', () => {
    // Reason: after show()/dispose(), removeListeners() runs unconditionally, so
    // flipping active false→true or ||→&& cannot be observed via window events.
  });

  it('resource errors without event.error are skipped', () => {
    const container = document.createElement('div');
    const handle = installGameErrorBoundary({
      gameName: 'Hex',
      container,
      onReset: vi.fn(),
      onHome: vi.fn(),
    });
    window.dispatchEvent(new ErrorEvent('error', { message: 'img fail' }));
    expect(handle.didCatch).toBe(false);
    handle.dispose();
  });

  it('onBeforeShow throw still shows crash UI', () => {
    const container = document.createElement('div');
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const handle = installGameErrorBoundary({
      gameName: 'Hex',
      container,
      onReset: vi.fn(),
      onHome: vi.fn(),
      onBeforeShow: () => {
        throw new Error('cleanup failed');
      },
    });
    window.dispatchEvent(
      new ErrorEvent('error', { error: new Error('boom'), message: 'boom' })
    );
    expect(handle.didCatch).toBe(true);
    expect(
      container.querySelector('[data-testid="game-error-boundary"]')
    ).not.toBeNull();
    errSpy.mockRestore();
    handle.dispose();
  });
});
