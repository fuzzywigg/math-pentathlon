/**
 * Wave 44 — Sum Dominoes formatMove + remaining handshake after settle. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  formatMove,
  getRemainingCount,
  passTurn,
} from '../../src/games/sum-dominoes/rules';
import {
  CONFIG,
  type Domino,
  type PlacedDomino,
  type SDMove,
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

describe('Wave 44 sum-dominoes — format/remaining after settle', () => {
  it('remaining counts unchanged by pass settle', () => {
    const state: SumDominoesState = {
      board: emptyBoard(),
      hands: {
        player1: [makeDomino('a', 1, 2), makeDomino('b', 3, 3)],
        player2: [makeDomino('c', 6, 6, 'player2')],
      },
      currentPlayer: 'player1',
      currentDice: [1, 1],
      selectedDomino: null,
      phase: 'passing',
      winner: null,
      moveHistory: [],
      passCount: 1,
    };
    const before1 = getRemainingCount(state, 'player1');
    const before2 = getRemainingCount(state, 'player2');
    const next = passTurn(state);
    expect(next.phase).toBe('gameOver');
    expect(getRemainingCount(next, 'player1')).toBe(before1);
    expect(getRemainingCount(next, 'player2')).toBe(before2);
    expect(next.winner).toBe('player1'); // 1+2+3+3=9 vs 12
  });

  it('formatMove still works for history recorded before settle', () => {
    const move: SDMove = {
      player: 'player2',
      domino: makeDomino('h', 2, 5, 'player2'),
      position: { row: 4, col: 5 },
      orientation: 'vertical',
      matchedFace: 2,
      adjacentFace: 4,
      diceSum: 6,
      moveNumber: 5,
    };
    expect(formatMove(move)).toBe('[2|5] (2+4=6)');
  });

  it('multi-tile pip sum settles correctly vs single high double', () => {
    const state: SumDominoesState = {
      board: emptyBoard(),
      hands: {
        player1: [
          makeDomino('a', 0, 0),
          makeDomino('b', 0, 1),
          makeDomino('c', 0, 2),
        ], // 3 pips
        player2: [makeDomino('d', 2, 2, 'player2')], // 4
      },
      currentPlayer: 'player2',
      currentDice: null,
      selectedDomino: null,
      phase: 'passing',
      winner: null,
      moveHistory: [],
      passCount: 1,
    };
    const next = passTurn(state);
    expect(next.winner).toBe('player1');
    expect(getRemainingCount(next, 'player1')).toBe(3);
    expect(getRemainingCount(next, 'player2')).toBe(1);
  });
});
