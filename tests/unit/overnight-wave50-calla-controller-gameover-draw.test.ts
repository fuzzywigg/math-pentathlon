/**
 * Overnight HEAVY leftover — Calla controller game-over click no-op via live sow.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { owlSystem } from '../../src/core/owl';
import {
  initGame,
  newGameVsHuman,
  getGameState,
} from '../../src/games/calla/game-controller';
import * as rules from '../../src/games/calla/rules';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Overnight wave50 calla — controller gameOver owl', () => {
  it('notifies owl with draw on tie and ignores later pit clicks', () => {
    const onEnd = vi.spyOn(owlSystem, 'onGameEnd');
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    newGameVsHuman();

    vi.spyOn(rules, 'makeMove').mockImplementation((state) => ({
      ...state,
      player1Pits: [0, 0, 0, 0, 0],
      player2Pits: [0, 0, 0, 0, 0],
      player1Calla: 15,
      player2Calla: 15,
      phase: 'gameOver',
      winner: 'tie',
      moveHistory: [
        {
          player: 'player1',
          pitIndex: 0,
          cubesDistributed: 1,
          captured: 0,
          gotFreeTurn: false,
          moveNumber: 1,
        },
      ],
    }));

    board
      .querySelector('.calla-pit-valid')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(getGameState().winner).toBe('tie');
    expect(onEnd).toHaveBeenCalledWith('calla', {
      winner: 'draw',
      moveCount: 1,
    });
    expect(status.textContent).toMatch(/Tie/i);

    onEnd.mockClear();
    board
      .querySelector('.calla-pit')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onEnd).not.toHaveBeenCalled();
    expect(getGameState().moveHistory).toHaveLength(1);
  });
});
