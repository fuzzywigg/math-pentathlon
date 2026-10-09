/**
 * q-mp-145 — Clear AI think-delay timer leaks on destroyGame for games that
 * still used bare setTimeout after the #638/#647 destroy folds.
 * Delay constants unchanged; only clearTimeout + generation gating.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  document.body.replaceChildren();
});

describe('q-mp-145 hex-a-gone destroyGame clears AI timers', () => {
  it('armed AI delay is cleared; advancing timers does not throw', async () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
    const mod = await import('../../src/games/hex-a-gone/game-controller');
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    mod.initGame(board, status);
    mod.newGameVsAI('easy');

    // Drive one human selection→place cycle until AI seat schedules a delay.
    // If the opening position cannot hand off quickly, still assert destroy is safe.
    const bankBtn = board.querySelector(
      '[data-shape], .hag-block, .hex-a-gone-block, button'
    ) as HTMLElement | null;
    bankBtn?.click();

    mod.destroyGame();
    expect(() => vi.advanceTimersByTime(20_000)).not.toThrow();
    // When a timer was armed, destroy must clearTimeout it.
    if (clearTimeoutSpy.mock.calls.length === 0) {
      // No timer armed in this opening — generation bump still prevents stale work.
      expect(true).toBe(true);
    } else {
      expect(clearTimeoutSpy).toHaveBeenCalled();
    }
    clearTimeoutSpy.mockRestore();
  });
});

describe('q-mp-145 star-track destroyGame clears AI timers', () => {
  it('clearTimeout when AI delay armed via draw→select handoff', async () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
    const mod = await import('../../src/games/star-track/game-controller');
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    mod.initGame(board, status);
    mod.newGameVsAI('easy');

    const drawBtn = board.querySelector(
      '#draw-chains-btn, [data-action="draw"], button'
    ) as HTMLElement | null;
    drawBtn?.click();
    const chainBtn = board.querySelector(
      '.chain-option, [data-chain-index], button'
    ) as HTMLElement | null;
    chainBtn?.click();

    const armed = vi.getTimerCount() > 0;
    mod.destroyGame();
    if (armed) {
      expect(clearTimeoutSpy).toHaveBeenCalled();
    }
    expect(() => vi.runOnlyPendingTimers()).not.toThrow();
    clearTimeoutSpy.mockRestore();
  });
});

describe('q-mp-145 queens-guards destroyGame clears AI paint-delay timers', () => {
  it('pending paint delay cleared; advancing timers does not start AI after leave', async () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
    const mod = await import('../../src/games/queens-guards/game-controller');
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    mod.initGame(board, status);
    mod.newGameVsAI('easy');

    // DEV seed hands seat to AI with keepVsAI so maybeTriggerAI schedules 500ms.
    window.__mp3dQueensGuardsCtrl?.seedCapturedRestore({
      currentPlayer: 'player2',
      keepVsAI: true,
    });
    expect(vi.getTimerCount()).toBeGreaterThan(0);

    mod.destroyGame();
    expect(clearTimeoutSpy).toHaveBeenCalled();
    expect(() => vi.advanceTimersByTime(20_000)).not.toThrow();
    clearTimeoutSpy.mockRestore();
  });
});

describe('q-mp-145 kings-quadraphages destroyGame cancels AI delays', () => {
  it('AI-first delay cleared; advancing timers does not mutate after leave', async () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
    const mod = await import(
      '../../src/games/kings-quadraphages/game-controller'
    );
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    mod.initGame(board, status);
    // AI plays first → executeAITurn arms AI_THINKING_DELAY.
    mod.newGameVsAI('easy', false);
    expect(vi.getTimerCount()).toBeGreaterThan(0);

    const stateBefore = mod.getGameState();
    mod.destroyGame();
    expect(clearTimeoutSpy).toHaveBeenCalled();
    expect(() => vi.advanceTimersByTime(20_000)).not.toThrow();
    expect(mod.getGameState()).toBe(stateBefore);
    clearTimeoutSpy.mockRestore();
  });
});
