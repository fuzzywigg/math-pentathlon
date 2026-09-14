/**
 * Wave 44 — Sum Dominoes selectDomino hand ownership and reselect. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { selectDomino, canPlayDomino } from '../../src/games/sum-dominoes/rules';
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

function seed(): (PlacedDomino | null)[][] {
  const board = emptyBoard();
  const d = makeDomino('seed', 6, 6, null);
  const placed: PlacedDomino = {
    domino: { ...d, orientation: 'horizontal' },
    position: { row: 5, col: 5 },
    orientation: 'horizontal',
  };
  board[5][5] = placed;
  board[5][6] = placed;
  return board;
}

function placing(overrides: Partial<SumDominoesState> = {}): SumDominoesState {
  return {
    board: seed(),
    hands: {
      player1: [makeDomino('a', 0, 2), makeDomino('b', 1, 0)],
      player2: [makeDomino('c', 0, 2, 'player2')],
    },
    currentPlayer: 'player1',
    currentDice: [3, 3], // 6
    selectedDomino: null,
    phase: 'placing',
    winner: null,
    moveHistory: [],
    passCount: 0,
    ...overrides,
  };
}

describe('Wave 44 sum-dominoes — selectDomino ownership / reselect', () => {
  it('can reselect from a to b when both playable', () => {
    const state = placing();
    expect(canPlayDomino(state, state.hands.player1[0], 6)).toBe(true);
    expect(canPlayDomino(state, state.hands.player1[1], 6)).toBe(true);
    const mid = selectDomino(state, 'a');
    expect(mid.selectedDomino).toBe('a');
    const next = selectDomino(mid, 'b');
    expect(next.selectedDomino).toBe('b');
  });

  it('player2 cannot select player1 tile id', () => {
    const state = placing({ currentPlayer: 'player2', currentDice: [3, 3] });
    expect(selectDomino(state, 'a')).toBe(state);
    expect(selectDomino(state, 'c').selectedDomino).toBe('c');
  });

  it('null dice blocks select even with playable hand', () => {
    const state = placing({ currentDice: null });
    expect(selectDomino(state, 'a')).toBe(state);
  });

  it('does not change phase or dice on successful select', () => {
    const state = placing();
    const next = selectDomino(state, 'a');
    expect(next.phase).toBe('placing');
    expect(next.currentDice).toEqual([3, 3]);
    expect(next.currentPlayer).toBe('player1');
  });
});
