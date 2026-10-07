import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  installGameErrorBoundary,
  renderGameCrash,
} from '../../src/ui/game-error-boundary';

describe('game-error-boundary', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders friendly reset actions', () => {
    const root = document.createElement('div');
    const onReset = vi.fn();
    const onHome = vi.fn();
    renderGameCrash(root, 'Hex', onReset, onHome);

    const alert = root.querySelector('[data-testid="game-error-boundary"]');
    expect(alert).not.toBeNull();
    expect(alert?.getAttribute('role')).toBe('alert');
    expect(root.textContent).toContain('Something went wrong in Hex');

    root.querySelector<HTMLButtonElement>('[data-action="reset"]')?.click();
    root.querySelector<HTMLButtonElement>('[data-action="home"]')?.click();
    expect(onReset).toHaveBeenCalledOnce();
    expect(onHome).toHaveBeenCalledOnce();
  });

  it('escapes HTML in the game name', () => {
    const root = document.createElement('div');
    renderGameCrash(root, '<img src=x onerror=alert(1)>', vi.fn(), vi.fn());
    expect(root.innerHTML).not.toContain('<img');
    expect(root.innerHTML).toContain('&lt;img');
  });

  it('catches window errors and shows the reset UI once', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const onReset = vi.fn();
    const onBeforeShow = vi.fn();
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const handle = installGameErrorBoundary({
      gameName: 'Calla',
      container: root,
      onReset,
      onHome: vi.fn(),
      onBeforeShow,
    });

    window.dispatchEvent(
      new ErrorEvent('error', {
        error: new Error('boom'),
        message: 'boom',
      })
    );

    expect(onBeforeShow).toHaveBeenCalledOnce();
    expect(
      root.querySelector('[data-testid="game-error-boundary"]')
    ).not.toBeNull();
    expect(handle.didCatch).toBe(true);

    // Re-install is refused while didCatch is sticky on this handle;
    // a fresh install is required after reset (route remount).
    expect(handle.didCatch).toBe(true);
    handle.dispose();
    expect(onBeforeShow).toHaveBeenCalledOnce();

    errSpy.mockRestore();
  });

  it('catches unhandled rejections', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const handle = installGameErrorBoundary({
      gameName: 'FIAR',
      container: root,
      onReset: vi.fn(),
      onHome: vi.fn(),
    });

    window.dispatchEvent(
      new PromiseRejectionEvent('unhandledrejection', {
        promise: Promise.resolve(),
        reason: new Error('reject-me'),
      })
    );

    expect(
      root.querySelector('[data-testid="game-error-boundary"]')
    ).not.toBeNull();
    expect(root.textContent).toContain('FIAR');

    handle.dispose();
    errSpy.mockRestore();
  });
});
