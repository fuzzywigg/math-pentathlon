/**
 * Overnight HEAVY leftover — Calla controller AI free-turn chain + null move.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import * as callaAi from '../../src/games/calla/ai';
import {
  initGame,
  newGameVsAI,
  getGameState,
} from '../../src/games/calla/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('Overnight wave50 calla — controller AI chain / null', () => {
  it('AI Calla-land keeps P2 after the thinking delay', () => {
    vi.useFakeTimers();
    const spy = vi.spyOn(callaAi, 'getAIMove');
    spy.mockReturnValueOnce({ pit: 2 }).mockReturnValueOnce({ pit: 0 });

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    newGameVsAI('medium');

    board
      .querySelector('.calla-pit[data-side="player1"][data-pit-index="0"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    vi.advanceTimersByTime(800);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(getGameState().moveHistory).toHaveLength(2);
    expect(getGameState().moveHistory[1]?.gotFreeTurn).toBe(true);
    expect(getGameState().currentPlayer).toBe('player2');

    vi.runOnlyPendingTimers();
    expect(spy.mock.calls.length).toBeGreaterThanOrEqual(1);
    expect(getGameState().moveHistory.length).toBeGreaterThanOrEqual(2);
  });

  it('clears thinking chrome when getAIMove returns null', () => {
    vi.useFakeTimers();
    vi.spyOn(callaAi, 'getAIMove').mockReturnValue(null);
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    newGameVsAI('hard');
    board
      .querySelector('.calla-pit[data-side="player1"][data-pit-index="0"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    vi.advanceTimersByTime(800);
    expect(getGameState().moveHistory).toHaveLength(1);
    expect(status.textContent).not.toMatch(/thinking/i);
  });
});
