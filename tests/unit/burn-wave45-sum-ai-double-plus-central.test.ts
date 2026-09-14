/**
 * Wave 45 — Sum AI double + central combo vs non-central non-double
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

describe('Wave 45 Sum AI — double plus central', () => {
  it('hard still prefers double when both can sit near center', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const dbl = makeDomino('dbl', 4, 4, 'player2');
    const oth = makeDomino('oth', 4, 2, 'player2');
    const state: SumDominoesState = {
      board: seedAt(5, 5, 4, 4),
      hands: { player1: [], player2: [oth, dbl] },
      currentPlayer: 'player2',
      currentDice: [4, 4],
      selectedDomino: null,
      phase: 'placing',
      winner: null,
      moveHistory: [],
      passCount: 0,
    };
    expect(getAIMove(state, 'player2', 'hard')?.dominoId).toBe('dbl');
  });
});
