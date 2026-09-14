/**
 * Wave 45 — Sum isAITurn ignores gameMode unlike Contig/Star
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
import { isAITurn } from '../../src/games/sum-dominoes/ai';


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

describe('Wave 45 Sum AI — isAITurn no gameMode', () => {
  it('true for current seat even without a gameMode argument', () => {
    const state: SumDominoesState = {
      board: seedAt(5, 5, 6, 6),
      hands: { player1: [], player2: [makeDomino('t', 1, 1, 'player2')] },
      currentPlayer: 'player2',
      currentDice: null,
      selectedDomino: null,
      phase: 'rolling',
      winner: null,
      moveHistory: [],
      passCount: 0,
    };
    expect(isAITurn(state, 'player2')).toBe(true);
    expect(isAITurn(state, 'player1')).toBe(false);
    expect(isAITurn(state, null)).toBe(false);
  });
});
