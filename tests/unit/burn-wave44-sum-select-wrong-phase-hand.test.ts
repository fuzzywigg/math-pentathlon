/**
 * Wave 44 — Sum Dominoes selectDomino wrong phase and hand. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { selectDomino, canPlayDomino } from '../../src/games/sum-dominoes/rules';
import {
  CONFIG,
  getDiceSum,
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

function seedCenter(): (PlacedDomino | null)[][] {
  const board = emptyBoard();
  const seed = makeDomino('seed', 6, 6, null);
  const placed: PlacedDomino = {
    domino: { ...seed, orientation: 'horizontal' },
    position: { row: 5, col: 5 },
    orientation: 'horizontal',
  };
  board[5][5] = placed;
  board[5][6] = placed;
  return board;
}

function base(overrides: Partial<SumDominoesState> = {}): SumDominoesState {
  return {
    board: seedCenter(),
    hands: {
      player1: [makeDomino('ok', 0, 1), makeDomino('dead', 0, 0)],
      player2: [makeDomino('opp', 0, 1, 'player2')],
    },
    currentPlayer: 'player1',
    currentDice: [3, 3], // sum 6
    selectedDomino: null,
    phase: 'placing',
    winner: null,
    moveHistory: [],
    passCount: 0,
    ...overrides,
  };
}

describe('Wave 44 sum-dominoes — selectDomino wrong phase/hand', () => {
  it('identity across all non-placing phases', () => {
    for (const phase of ['rolling', 'passing', 'gameOver'] as const) {
      const state = base({ phase });
      expect(selectDomino(state, 'ok')).toBe(state);
    }
  });

  it('identity for opponent-hand id even if playable shape', () => {
    const state = base();
    expect(canPlayDomino(state, state.hands.player2[0], getDiceSum(state.currentDice!))).toBe(true);
    expect(selectDomino(state, 'opp')).toBe(state);
  });

  it('identity for unplayable own-hand id', () => {
    const state = base();
    // dead 0|0 with sum 6 is playable actually (0+6) — use sum that fails
    const blocked = base({ currentDice: [6, 6] }); // sum 12 — 0+0 cannot
    expect(selectDomino(blocked, 'dead')).toBe(blocked);
    expect(selectDomino(blocked, 'ok')).toBe(blocked);
  });

  it('selects playable own tile and leaves hand intact', () => {
    const state = base();
    expect(canPlayDomino(state, state.hands.player1[0], 6)).toBe(true);
    const next = selectDomino(state, 'ok');
    expect(next.selectedDomino).toBe('ok');
    expect(next.hands.player1).toHaveLength(2);
    expect(next.phase).toBe('placing');
  });

  it('identity when selected id empty string', () => {
    const state = base();
    expect(selectDomino(state, '')).toBe(state);
  });
});
