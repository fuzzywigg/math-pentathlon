/**
 * Wave 45 — Sum Dominoes AI central placement preference
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

describe('Wave 45 Sum AI — central preference', () => {
  it('hard prefers a placement nearer (5,5) when pip counts match', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    // Single 2-2 tile vs 6-6 center; sum 8 → need face 2 against face 6
    const tile = makeDomino('t', 2, 2, 'player2');
    const state: SumDominoesState = {
      board: seedAt(5, 5, 6, 6),
      hands: { player1: [], player2: [tile] },
      currentPlayer: 'player2',
      currentDice: [2, 6],
      selectedDomino: null,
      phase: 'placing',
      winner: null,
      moveHistory: [],
      passCount: 0,
    };
    const move = getAIMove(state, 'player2', 'hard');
    expect(move).not.toBeNull();
    expect(move!.dominoId).toBe('t');
    const dist = Math.abs(move!.position.row - 5) + Math.abs(move!.position.col - 5);
    expect(dist).toBeLessThanOrEqual(3);
  });
});
