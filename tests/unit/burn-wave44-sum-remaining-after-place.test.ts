/**
 * Wave 44 — Sum Dominoes getRemainingCount after place deplete. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  getRemainingCount,
  placeDomino,
  getValidPlacements,
} from '../../src/games/sum-dominoes/rules';
import {
  CONFIG,
  type Domino,
  type PlacedDomino,
  type SumDominoesState,
} from '../../src/games/sum-dominoes/types';

function makeDomino(id: string, face1: number, face2: number, owner: Domino['owner'] = 'player1'): Domino {
  return { id, face1, face2, owner, orientation: 'horizontal' };
}

function emptyBoard(): (PlacedDomino | null)[][] {
  return Array.from({ length: CONFIG.BOARD_SIZE }, () =>
    Array.from({ length: CONFIG.BOARD_SIZE }, () => null)
  );
}

describe('Wave 44 sum-dominoes — remaining count after place', () => {
  it('decrements only the placing seat', () => {
    const board = emptyBoard();
    const seed = makeDomino('seed', 6, 6, null);
    const placed: PlacedDomino = {
      domino: { ...seed, orientation: 'horizontal' },
      position: { row: 5, col: 5 },
      orientation: 'horizontal',
    };
    board[5][5] = placed;
    board[5][6] = placed;
    const state: SumDominoesState = {
      board,
      hands: {
        player1: [makeDomino('a', 0, 0), makeDomino('b', 1, 1), makeDomino('c', 2, 2)],
        player2: [makeDomino('x', 3, 3, 'player2'), makeDomino('y', 4, 4, 'player2')],
      },
      currentPlayer: 'player1',
      currentDice: [3, 3],
      selectedDomino: 'a',
      phase: 'placing',
      winner: null,
      moveHistory: [],
      passCount: 0,
    };
    expect(getRemainingCount(state, 'player1')).toBe(3);
    expect(getRemainingCount(state, 'player2')).toBe(2);
    const pick = getValidPlacements(state, state.hands.player1[0], 6)[0];
    const next = placeDomino(state, pick.position, pick.orientation);
    expect(getRemainingCount(next, 'player1')).toBe(2);
    expect(getRemainingCount(next, 'player2')).toBe(2);
  });

  it('winner empty hand reports zero remaining', () => {
    const board = emptyBoard();
    const seed = makeDomino('seed', 6, 6, null);
    const placed: PlacedDomino = {
      domino: { ...seed, orientation: 'horizontal' },
      position: { row: 5, col: 5 },
      orientation: 'horizontal',
    };
    board[5][5] = placed;
    board[5][6] = placed;
    const state: SumDominoesState = {
      board,
      hands: {
        player1: [makeDomino('last', 0, 0)],
        player2: [makeDomino('x', 3, 3, 'player2')],
      },
      currentPlayer: 'player1',
      currentDice: [3, 3],
      selectedDomino: 'last',
      phase: 'placing',
      winner: null,
      moveHistory: [],
      passCount: 0,
    };
    const pick = getValidPlacements(state, state.hands.player1[0], 6)[0];
    const next = placeDomino(state, pick.position, pick.orientation);
    expect(next.winner).toBe('player1');
    expect(getRemainingCount(next, 'player1')).toBe(0);
    expect(getRemainingCount(next, 'player2')).toBe(1);
  });
});
