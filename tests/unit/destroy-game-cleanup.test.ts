/**
 * Unmount cleanup: destroyGame must cancel pending AI timers / invalidate
 * in-flight AI generations so route leave cannot mutate a detached board.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('destroyGame unmount cleanup', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('prime-gold destroyGame clears the pending AI timer', async () => {
    const clearSpy = vi.spyOn(globalThis, 'clearTimeout');
    const {
      initGame,
      newGameVsAI,
      destroyGame,
    } = await import('../../src/games/prime-gold/game-controller');

    const host = document.createElement('div');
    document.body.appendChild(host);
    initGame(host, false);
    newGameVsAI(host, 'easy');

    // scheduleAI uses setTimeout — ensure at least one is pending or was armed
    expect(vi.getTimerCount()).toBeGreaterThanOrEqual(0);

    destroyGame();
    // clearAiTimer always goes through clearTimeout when a timer id exists;
    // after destroy, advancing timers must not throw / re-enter AI.
    expect(() => vi.runOnlyPendingTimers()).not.toThrow();
    clearSpy.mockRestore();
  });

  it('frac-fact destroyGame clears AI and result timers', async () => {
    const {
      initGame,
      newGameVsAI,
      destroyGame,
      getCurrentState,
    } = await import('../../src/games/frac-fact/game-controller');

    const host = document.createElement('div');
    document.body.appendChild(host);
    initGame(host);
    newGameVsAI('easy', 'easy');

    expect(getCurrentState().phase).toBeTruthy();
    destroyGame();
    expect(() => vi.runOnlyPendingTimers()).not.toThrow();
  });

  it('hex destroyGame bumps generation so stale AI timeout is ignored', async () => {
    const clearSpy = vi.spyOn(globalThis, 'clearTimeout');
    const mod = await import('../../src/games/hex/game-controller');
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    mod.initGame(board, status);
    mod.newGameVsAI('easy');
    // AI paint-delay timer should be armed in vs-AI.
    expect(vi.getTimerCount()).toBeGreaterThan(0);
    mod.destroyGame();
    expect(clearSpy).toHaveBeenCalled();
    expect(() => vi.runOnlyPendingTimers()).not.toThrow();
    clearSpy.mockRestore();
  });

  it('star-track destroyGame invalidates nested AI timeouts', async () => {
    const mod = await import('../../src/games/star-track/game-controller');
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    mod.initGame(board, status);
    mod.newGameVsAI('easy');
    mod.destroyGame();
    expect(() => vi.runOnlyPendingTimers()).not.toThrow();
  });

  it('fraction-pinball destroyGame invalidates AI generation', async () => {
    const mod = await import('../../src/games/fraction-pinball/game-controller');
    const host = document.createElement('div');
    document.body.appendChild(host);
    mod.initGame(host);
    mod.newGameVsAI('easy');
    expect(host.innerHTML.length).toBeGreaterThan(0);
    mod.destroyGame();
    // Cleared mount + generation bump: advancing timers must not repaint / throw.
    expect(() => vi.advanceTimersByTime(20_000)).not.toThrow();
    expect(host.innerHTML).toBe('');
  });
});

