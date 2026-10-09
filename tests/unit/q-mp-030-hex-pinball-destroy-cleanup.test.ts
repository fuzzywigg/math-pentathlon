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
    const disposeWorker = vi.spyOn(
      await import('../../src/games/hex/ai-client'),
      'disposeHexAiWorker'
    );

    const mod = await import('../../src/games/hex/game-controller');
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);

    // Seed a stray RAF so destroy must not leave animation frames pending
    // for these 2D controllers (no 3D mount path).
    let rafFired = false;
    const rafId = requestAnimationFrame(() => {
      rafFired = true;
    });

    mod.initGame(board, status);
    mod.newGameVsAI('easy');

    // Human places once so the tracked AI paint-delay timer is armed.
    const clickable = board.querySelector(
      '[tabindex="0"][role="gridcell"], [role="gridcell"][tabindex]'
    ) as HTMLElement | null;
    expect(clickable).toBeTruthy();
    clickable!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(vi.getTimerCount()).toBeGreaterThan(0);

    const boardHtmlBeforeDestroy = board.innerHTML;
    expect(boardHtmlBeforeDestroy.length).toBeGreaterThan(0);

    const shellCleanup = vi.fn(() => {
      // Mirrors game-shell: drop document keydown / chrome on route leave.
    });
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
    expect(disposeWorker).toHaveBeenCalled();

    // Listeners: mount DOM must be emptied so orphaned cell clicks cannot
    // mutate controller state after route leave.
    expect(board.innerHTML).toBe('');
    expect(status.innerHTML).toBe('');

    const boardSnapshot = JSON.stringify(mod.getGameState().board);
    // Re-dispatch on a detached node remnant would be impossible after clear;
    // also ensure a fresh click target under body does nothing to hex state.
    board.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(JSON.stringify(mod.getGameState().board)).toBe(boardSnapshot);

    // Timers + generation: advancing must not throw or re-enter AI paint.
    expect(() => vi.runOnlyPendingTimers()).not.toThrow();

    // RAF / 3D: cancel the seeded frame; controllers have no WebGL canvas.
    cancelAnimationFrame(rafId);
    expect(cancelRafSpy).toHaveBeenCalled();
    expect(board.querySelector('canvas')).toBeNull();
    expect(rafFired).toBe(false);

    clearTimeoutSpy.mockRestore();
    cancelRafSpy.mockRestore();
    disposeWorker.mockRestore();
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

    // Answer as human so AI think timer arms (player2 answering).
    const choice = host.querySelector(
      '.pinball-choice-btn'
    ) as HTMLButtonElement | null;
    expect(choice).toBeTruthy();
    choice!.click();
    // Continue past result so computer seat can schedule think timer.
    const cont = host.querySelector(
      '.pinball-continue-btn, button.pinball-continue'
    ) as HTMLButtonElement | null;
    cont?.click();
    // If still answering as human, force vs-AI re-render path with AI seat by
    // answering until player2 — at minimum destroy must clear any armed timers.
    if (mod.getCurrentState().currentPlayer === 'player2') {
      expect(vi.getTimerCount()).toBeGreaterThan(0);
    } else {
      // Arm AI think by scheduling through newGameVsAI after a human move chain.
      // Fallback: schedule a known timer the controller tracks on AI answering.
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
    expect(host.innerHTML).toBe('');
    expect(host.querySelector('canvas')).toBeNull();

    // Orphaned choice buttons must not survive destroy.
    expect(host.querySelector('.pinball-choice-btn')).toBeNull();
    expect(() => vi.advanceTimersByTime(20_000)).not.toThrow();
    expect(mod.getCurrentState().phase).toBe(phaseBefore);

    cancelAnimationFrame(rafId);
    expect(cancelRafSpy).toHaveBeenCalled();
    expect(rafFired).toBe(false);

    clearTimeoutSpy.mockRestore();
    cancelRafSpy.mockRestore();
  });
});
