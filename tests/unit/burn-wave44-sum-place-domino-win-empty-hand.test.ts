/**
 * Wave 44 — Sum Dominoes empty-hand win leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { CONFIG, Domino, PlacedDomino } from '../../src/games/sum-dominoes/types';
import { placeDomino } from '../../src/games/sum-dominoes/rules';

function emptyBoard(): (PlacedDomino | null)[][] {
  return Array.from({ length: CONFIG.BOARD_SIZE }, () =>
    Array.from({ length: CONFIG.BOARD_SIZE }, () => null)
  );
}

describe('Wave 44 Sum Dominoes — place empty-hand win', () => {
  it('last tile empties hand and ends game', () => {
    const board = emptyBoard();
    const seed: Domino = {
      id: 'seed',
      face1: 6,
      face2: 6,
      owner: null,
      orientation: 'horizontal',
    };
    const placed: PlacedDomino = {
      domino: seed,
      position: { row: 5, col: 5 },
      orientation: 'horizontal',
    };
    board[5][5] = placed;
    board[5][6] = placed;
    const last: Domino = {
      id: 'last',
      face1: 1,
      face2: 2,
      owner: 'player1',
      orientation: 'horizontal',
    };
    const state = {
      board,
      hands: {
        player1: [last],
        player2: [{ ...last, id: 'p2', owner: 'player2' as const }],
      },
      currentPlayer: 'player1' as const,
      currentDice: [3, 4] as [number, number],
      selectedDomino: 'last',
      phase: 'placing' as const,
      winner: null,
      moveHistory: [],
      passCount: 2,
    };
    const next = placeDomino(state, { row: 5, col: 7 }, 'horizontal');
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
    expect(next.hands.player1).toHaveLength(0);
    expect(next.passCount).toBe(0);
    expect(next.moveHistory).toHaveLength(1);
  });
});
