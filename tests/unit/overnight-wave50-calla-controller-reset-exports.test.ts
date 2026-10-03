/**
 * Overnight HEAVY leftover — Calla controller reset mode, chrome, index reexports.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { owlSystem } from '../../src/core/owl';
import {
  initGame,
  newGameVsAI,
  newGameVsHuman,
  resetGame,
  getGameState,
  getCurrentHint,
} from '../../src/games/calla/game-controller';
import {
  createInitialState,
  makeMove,
  renderBoard,
  renderStatus,
} from '../../src/games/calla';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Overnight wave50 calla — controller reset / exports', () => {
  it('reset after vs-AI keeps You/AI labels and zeros history', () => {
    const onStart = vi.spyOn(owlSystem, 'onGameStart');
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    newGameVsAI('hard');
    board
      .querySelector('.calla-pit-valid')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getGameState().moveHistory.length).toBeGreaterThan(0);
    resetGame();
    expect(getGameState().moveHistory).toHaveLength(0);
    expect(getGameState().player1Calla).toBe(0);
    expect(getCurrentHint()).toBeNull();
    expect(status.textContent).toMatch(/You/);
    expect(status.textContent).toMatch(/AI/);
    expect(onStart).toHaveBeenCalledWith('calla');

    newGameVsHuman();
    resetGame();
    expect(status.textContent).toMatch(/Blue/);
    expect(status.textContent).toMatch(/Red/);
  });

  it('index re-exports types/rules/board-ui used by the controller', () => {
    const s = createInitialState();
    expect(makeMove(s, 2).moveHistory[0].gotFreeTurn).toBe(true);
    const board = document.createElement('div');
    const status = document.createElement('div');
    renderBoard(s, board);
    renderStatus(s, status);
    expect(board.querySelector('.calla-board')).toBeTruthy();
    expect(status.querySelector('.calla-status')).toBeTruthy();
  });
});
