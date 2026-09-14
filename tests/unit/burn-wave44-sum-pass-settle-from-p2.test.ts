/**
 * Wave 44 — Sum Dominoes passTurn settle from player2 seat. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { passTurn } from '../../src/games/sum-dominoes/rules';
import {
  type Domino,
  type PlacedDomino,
  type SumDominoesState,
  CONFIG,
} from '../../src/games/sum-dominoes/types';

function makeDomino(id: string, face1: number, face2: number, owner: Domino['owner'] = 'player1'): Domino {
  return { id, face1, face2, owner, orientation: 'horizontal' };
}

function emptyBoard(): (PlacedDomino | null)[][] {
  return Array.from({ length: CONFIG.BOARD_SIZE }, () =>
    Array.from({ length: CONFIG.BOARD_SIZE }, () => null)
  );
}

function passing(overrides: Partial<SumDominoesState> = {}): SumDominoesState {
  return {
    board: emptyBoard(),
    hands: {
      player1: [makeDomino('a', 2, 3)],
      player2: [makeDomino('b', 4, 4, 'player2')],
    },
    currentPlayer: 'player2',
    currentDice: [2, 2],
    selectedDomino: null,
    phase: 'passing',
    winner: null,
    moveHistory: [],
    passCount: 1,
    ...overrides,
  };
}

describe('Wave 44 sum-dominoes — passTurn settle from player2', () => {
  it('player2 second pass settles by pip totals', () => {
    const next = passTurn(
      passing({
        hands: {
          player1: [makeDomino('low', 0, 1)], // 1
          player2: [makeDomino('high', 6, 5, 'player2')], // 11
        },
      })
    );
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
    expect(next.currentPlayer).toBe('player2'); // seat frozen on settle
  });

  it('empty hands both settle as draw', () => {
    const next = passTurn(
      passing({
        hands: { player1: [], player2: [] },
      })
    );
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBeNull();
  });

  it('single empty hand vs tiles awards empty seat', () => {
    const next = passTurn(
      passing({
        hands: {
          player1: [],
          player2: [makeDomino('only', 1, 1, 'player2')],
        },
      })
    );
    expect(next.winner).toBe('player1');
  });

  it('passCount already >=2 still increments path via passTurn when still passing', () => {
    // Implementation checks newPassCount >= 2 after increment from passCount
    const state = passing({ passCount: 1 });
    const next = passTurn(state);
    expect(next.passCount).toBe(2);
    expect(next.phase).toBe('gameOver');
  });
});
