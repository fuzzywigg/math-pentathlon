/**
 * Wave 44 — Sum Dominoes passTurn both-pass settle winner. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { passTurn } from '../../src/games/sum-dominoes/rules';
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

function base(overrides: Partial<SumDominoesState> = {}): SumDominoesState {
  return {
    board: emptyBoard(),
    hands: {
      player1: [makeDomino('p1', 2, 2)],
      player2: [makeDomino('p2', 5, 5, 'player2')],
    },
    currentPlayer: 'player1',
    currentDice: [1, 1],
    selectedDomino: null,
    phase: 'passing',
    winner: null,
    moveHistory: [],
    passCount: 0,
    ...overrides,
  };
}

describe('Wave 44 sum-dominoes — passTurn both-pass settle', () => {
  it('second pass awards player2 when opponent has fewer pips', () => {
    const state = base({
      passCount: 1,
      hands: {
        player1: [makeDomino('hi', 6, 6)], // 12
        player2: [makeDomino('lo', 0, 1, 'player2')], // 1
      },
    });
    const next = passTurn(state);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player2');
    expect(next.passCount).toBe(2);
  });

  it('second pass awards player1 on lower multi-tile pip total', () => {
    const state = base({
      passCount: 1,
      hands: {
        player1: [makeDomino('a', 1, 0), makeDomino('b', 1, 1)], // 3
        player2: [makeDomino('c', 4, 4, 'player2')], // 8
      },
    });
    const next = passTurn(state);
    expect(next.winner).toBe('player1');
    expect(next.phase).toBe('gameOver');
  });

  it('second pass draw keeps winner null on equal pips', () => {
    const state = base({
      passCount: 1,
      hands: {
        player1: [makeDomino('a', 3, 4)], // 7
        player2: [makeDomino('b', 2, 5, 'player2')], // 7
      },
    });
    const next = passTurn(state);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBeNull();
  });

  it('first pass does not settle even with pip imbalance', () => {
    const state = base({
      passCount: 0,
      currentPlayer: 'player2',
      hands: {
        player1: [makeDomino('hi', 6, 6)],
        player2: [makeDomino('lo', 0, 0, 'player2')],
      },
    });
    const next = passTurn(state);
    expect(next.phase).toBe('rolling');
    expect(next.winner).toBeNull();
    expect(next.currentPlayer).toBe('player1');
    expect(next.passCount).toBe(1);
    expect(next.currentDice).toBeNull();
  });

  it('identity when phase is not passing during settle attempt', () => {
    const state = base({ phase: 'gameOver', passCount: 1 });
    expect(passTurn(state)).toBe(state);
  });
});
