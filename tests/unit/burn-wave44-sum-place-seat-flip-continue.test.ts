/**
 * Wave 44 — Sum Dominoes place midgame seat flip leftovers.
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

describe('Wave 44 Sum Dominoes — place seat flip continue', () => {
  it('non-final place flips to opponent rolling', () => {
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
    const a: Domino = {
      id: 'a',
      face1: 1,
      face2: 2,
      owner: 'player1',
      orientation: 'horizontal',
    };
    const b: Domino = {
      id: 'b',
      face1: 3,
      face2: 4,
      owner: 'player1',
      orientation: 'horizontal',
    };
    const state = {
      board,
      hands: { player1: [a, b], player2: [] },
      currentPlayer: 'player1' as const,
      currentDice: [3, 4] as [number, number],
      selectedDomino: 'a',
      phase: 'placing' as const,
      winner: null,
      moveHistory: [],
      passCount: 0,
    };
    const next = placeDomino(state, { row: 5, col: 7 }, 'horizontal');
    expect(next.phase).toBe('rolling');
    expect(next.currentPlayer).toBe('player2');
    expect(next.hands.player1).toHaveLength(1);
    expect(next.selectedDomino).toBeNull();
  });
});
