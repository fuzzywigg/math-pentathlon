/**
 * Wave 44 — Sum Dominoes selectDomino gate leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { CONFIG, Domino, PlacedDomino } from '../../src/games/sum-dominoes/types';
import { selectDomino } from '../../src/games/sum-dominoes/rules';

function emptyBoard(): (PlacedDomino | null)[][] {
  return Array.from({ length: CONFIG.BOARD_SIZE }, () =>
    Array.from({ length: CONFIG.BOARD_SIZE }, () => null)
  );
}

describe('Wave 44 Sum Dominoes — selectDomino gates', () => {
  it('rejects wrong phase, missing id, and unplayable', () => {
    const board = emptyBoard();
    const seed: Domino = { id: 'seed', face1: 6, face2: 6, owner: null, orientation: 'horizontal' };
    const placed: PlacedDomino = { domino: seed, position: { row: 5, col: 5 }, orientation: 'horizontal' };
    board[5][5] = placed;
    board[5][6] = placed;
    const playable: Domino = { id: 'ok', face1: 1, face2: 2, owner: 'player1', orientation: 'horizontal' };
    const dead: Domino = { id: 'dead', face1: 0, face2: 0, owner: 'player1', orientation: 'horizontal' };
    const state = {
      board,
      hands: { player1: [playable, dead], player2: [] },
      currentPlayer: 'player1' as const,
      currentDice: [3, 4] as [number, number],
      selectedDomino: null,
      phase: 'placing' as const,
      winner: null,
      moveHistory: [],
      passCount: 0,
    };
    expect(selectDomino({ ...state, phase: 'rolling' }, 'ok')).toEqual({ ...state, phase: 'rolling' });
    expect(selectDomino(state, 'ghost')).toEqual(state);
    expect(selectDomino(state, 'dead')).toEqual(state);
    expect(selectDomino(state, 'ok').selectedDomino).toBe('ok');
  });
});
