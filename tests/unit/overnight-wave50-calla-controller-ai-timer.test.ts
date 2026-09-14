/**
 * Overnight HEAVY leftover — Calla controller vs-AI timer + thinking chrome.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import * as callaAi from '../../src/games/calla/ai';
import {
  initGame,
  newGameVsAI,
  getGameState,
  getCurrentHint,
  setAIDifficulty,
} from '../../src/games/calla/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('Overnight wave50 calla — controller AI turn', () => {
  it('P1 pit 0 handoff shows thinking then applies mocked AI pit + hint', () => {
    vi.useFakeTimers();
    vi.spyOn(callaAi, 'getAIMove').mockReturnValue({
      pit: 0,
      hint: 'Look carefully! There is a capture.',
    });

    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);

    initGame(board, status);
    setAIDifficulty('easy');
    newGameVsAI('easy');
    expect(app.dataset.opponent).toBe('ai');
    expect(getCurrentHint()).toBeNull();

    const pit = board.querySelector(
      '.calla-pit[data-side="player1"][data-pit-index="0"]'
    );
    pit?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getGameState().moveHistory).toHaveLength(1);
    expect(getGameState().currentPlayer).toBe('player2');
    expect(status.textContent).toMatch(/thinking/i);

    const during = getGameState().moveHistory.length;
    board
      .querySelector('.calla-pit[data-side="player1"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getGameState().moveHistory.length).toBe(during);

    vi.advanceTimersByTime(800);
    expect(callaAi.getAIMove).toHaveBeenCalled();
    expect(getGameState().moveHistory.length).toBeGreaterThan(during);
    expect(getCurrentHint()).toMatch(/Look carefully/);
  });
});
