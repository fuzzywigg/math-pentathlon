/**
 * Wave 43 — Sum Dominoes selectDomino unplayable identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { selectDomino } from '../../src/games/sum-dominoes/rules';
import {
  CONFIG,
  type Domino,
  type PlacedDomino,
  type SumDominoesState,
} from '../../src/games/sum-dominoes/types';

function emptyBoard(): (PlacedDomino | null)[][] {
  return Array.from({ length: CONFIG.BOARD_SIZE }, () =>
    Array.from({ length: CONFIG.BOARD_SIZE }, () => null)
  );
}

function makeDomino(id: string, face1: number, face2: number): Domino {
  return { id, face1, face2, owner: 'player1', orientation: 'horizontal' };
}

describe('Wave 43 sum-dominoes — select unplayable', () => {
  it('unplayable tile selection is identity', () => {
    const seedDom = makeDomino('seed', 6, 6);
    const placed: PlacedDomino = {
      domino: { ...seedDom, owner: null, orientation: 'horizontal' },
      position: { row: 5, col: 5 },
      orientation: 'horizontal',
    };
    const board = emptyBoard();
    board[5][5] = placed;
    board[5][6] = placed;
    const keep = makeDomino('keep', 1, 1);
    const state: SumDominoesState = {
      board,
      hands: { player1: [keep], player2: [] },
      currentPlayer: 'player1',
      currentDice: [3, 5], // sum 8 — 1+1 cannot adjoin 6
      selectedDomino: null,
      phase: 'placing',
      winner: null,
      moveHistory: [],
      passCount: 0,
    };
    expect(selectDomino(state, keep.id)).toBe(state);
  });
});
