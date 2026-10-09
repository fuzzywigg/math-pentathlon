/**
 * q-mp-030 — After the alpha restore, hex / fraction-pinball destroyGame looked
 * like a no-op for remount leaks. Mount → destroy must release listeners,
 * timers, RAF, 3D resources (N/A here), and the route wrapper must still call
 * shell.cleanup.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { disposeHexAiWorker } from '../../src/games/hex/ai-client';

describe('q-mp-030 hex destroyGame resource release', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    disposeHexAiWorker();
    vi.useRealTimers();
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('mount → destroy releases listeners, timers, worker; shell.cleanup runs', async () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
    const cancelRafSpy = vi.spyOn(globalThis, 'cancelAnimationFrame');

    const mod = await import('../../src/games/hex/game-controller');
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);

    // Seed a stray RAF (controllers are 2D-only — no board3d). Destroy path
    // must leave no WebGL canvas; the test cancels the seeded frame itself.
    let rafFired = false;
    const rafId = requestAnimationFrame(() => {
      rafFired = true;
    });

    mod.initGame(board, status);
    mod.newGameVsAI('easy');

    // Human places once so the tracked AI paint-delay timer is armed.
    const clickable = board.querySelector(
      '[role="gridcell"][tabindex="0"], [role="gridcell"][style*="cursor"]'
    ) as HTMLElement | null;
    expect(clickable).toBeTruthy();
    clickable!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(vi.getTimerCount()).toBeGreaterThan(0);

    expect(board.innerHTML.length).toBeGreaterThan(0);

    const shellCleanup = vi.fn();
    const routeCleanup = () => {
      try {
        mod.destroyGame();
      } finally {
        shellCleanup();
      }
    };
    routeCleanup();

    expect(shellCleanup).toHaveBeenCalledOnce();
    expect(clearTimeoutSpy).toHaveBeenCalled();

    // Listeners: mount DOM emptied so orphaned cell clicks cannot mutate state.
    expect(board.innerHTML).toBe('');
    expect(status.innerHTML).toBe('');
    expect(board.querySelector('canvas')).toBeNull();

    const boardSnapshot = JSON.stringify(mod.getGameState().board);
    board.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(JSON.stringify(mod.getGameState().board)).toBe(boardSnapshot);

    // Cancel seeded RAF before flushing timers (fake timers also drive rAF).
    cancelAnimationFrame(rafId);
    expect(cancelRafSpy).toHaveBeenCalled();
    expect(rafFired).toBe(false);

    expect(() => vi.runOnlyPendingTimers()).not.toThrow();

    clearTimeoutSpy.mockRestore();
    cancelRafSpy.mockRestore();
  });
});

describe('q-mp-030 fraction-pinball destroyGame resource release', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('mount → destroy releases listeners, timers; shell.cleanup runs', async () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
    const cancelRafSpy = vi.spyOn(globalThis, 'cancelAnimationFrame');

    const mod = await import('../../src/games/fraction-pinball/game-controller');
    const host = document.createElement('div');
    document.body.appendChild(host);

    let rafFired = false;
    const rafId = requestAnimationFrame(() => {
      rafFired = true;
    });

    mod.initGame(host);
    mod.newGameVsAI('easy');

    // Answer as human so AI think timer can arm on player2.
    const choice = host.querySelector(
      '.pinball-choice-btn'
    ) as HTMLButtonElement | null;
    expect(choice).toBeTruthy();
    choice!.click();
    const cont = host.querySelector(
      '.pinball-continue-btn, button.pinball-continue'
    ) as HTMLButtonElement | null;
    cont?.click();
    if (mod.getCurrentState().currentPlayer !== 'player2') {
      mod.newGameVsAI('easy');
    }

    expect(host.innerHTML.length).toBeGreaterThan(0);
    const phaseBefore = mod.getCurrentState().phase;

    const shellCleanup = vi.fn();
    const routeCleanup = () => {
      try {
        mod.destroyGame();
      } finally {
        shellCleanup();
      }
    };
    routeCleanup();

    expect(shellCleanup).toHaveBeenCalledOnce();
    expect(clearTimeoutSpy).toHaveBeenCalled();
    expect(host.innerHTML).toBe('');
    expect(host.querySelector('canvas')).toBeNull();
    expect(host.querySelector('.pinball-choice-btn')).toBeNull();

    cancelAnimationFrame(rafId);
    expect(cancelRafSpy).toHaveBeenCalled();
    expect(rafFired).toBe(false);

    expect(() => vi.advanceTimersByTime(20_000)).not.toThrow();
    expect(mod.getCurrentState().phase).toBe(phaseBefore);

    clearTimeoutSpy.mockRestore();
    cancelRafSpy.mockRestore();
  });
});
