/**
 * Wave 45 — Sum Dominoes AI last-tile +1000 vs competing high-pip
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  SumDominoesState,
  Domino,
  PlacedDomino,
  CONFIG,
} from '../../src/games/sum-dominoes/types';
import { getAIMove } from '../../src/games/sum-dominoes/ai';
import { canPlayDomino } from '../../src/games/sum-dominoes/rules';


afterEach(() => vi.restoreAllMocks());

function emptyBoard(): (PlacedDomino | null)[][] {
  return Array.from({ length: CONFIG.BOARD_SIZE }, () =>
    Array.from({ length: CONFIG.BOARD_SIZE }, () => null)
  );
}
function makeDomino(
  id: string,
  face1: number,
  face2: number,
  owner: Domino['owner'] = 'player1'
): Domino {
  return { id, face1, face2, owner, orientation: 'horizontal' };
}
function seedAt(
  row: number,
  col: number,
  face1: number,
  face2: number,
  orientation: 'horizontal' | 'vertical' = 'horizontal'
): (PlacedDomino | null)[][] {
  const board = emptyBoard();
  const placed: PlacedDomino = {
    domino: { ...makeDomino('seed', face1, face2, null), orientation },
    position: { row, col },
    orientation,
  };
  board[row][col] = placed;
  if (orientation === 'horizontal') board[row][col + 1] = placed;
  else board[row + 1][col] = placed;
  return board;
}

describe('Wave 45 Sum AI — last tile bonus among two', () => {
  it('last-tile +1000 applies only at hand size 1; two playable tiles still prefer high pips', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    // Factor 6 only when hand.length===1. With two playable, high-pip wins.
    // Document: with TWO tiles both playable, last-tile bonus does NOT apply.
    const high = makeDomino('hi', 6, 5, 'player2');
    const low = makeDomino('lo', 6, 1, 'player2');
    const state: SumDominoesState = {
      board: seedAt(5, 5, 6, 6),
      hands: { player1: [], player2: [low, high] },
      currentPlayer: 'player2',
      currentDice: [6, 6],
      selectedDomino: null,
      phase: 'placing',
      winner: null,
      moveHistory: [],
      passCount: 0,
    };
    expect(canPlayDomino(state, high, 12)).toBe(true);
    expect(canPlayDomino(state, low, 12)).toBe(true);
    const two = getAIMove(state, 'player2', 'hard');
    expect(two?.dominoId).toBe('hi');
    const lastState = { ...state, hands: { player1: [], player2: [low] } };
    const last = getAIMove(lastState, 'player2', 'hard');
    expect(last?.dominoId).toBe('lo');
  });
});
