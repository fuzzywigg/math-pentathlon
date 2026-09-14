/**
 * Wave 45 — Sum AI place stamps vertical second cell same object
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
import { executeAITurn } from '../../src/games/sum-dominoes/ai';
import { getValidPlacements } from '../../src/games/sum-dominoes/rules';


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

describe('Wave 45 Sum AI — vertical stamp identity', () => {
  it('AI-placed vertical (or any) occupies two cells with same object', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
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
    expect(getValidPlacements(state, tile, 8).length).toBeGreaterThan(0);
    const next = executeAITurn(state, 'player2', 'hard');
    expect(next.moveHistory).toHaveLength(1);
    const pos = next.moveHistory[0].position;
    const ori = next.moveHistory[0].orientation;
    const a = next.board[pos.row][pos.col];
    const b =
      ori === 'horizontal' ? next.board[pos.row][pos.col + 1] : next.board[pos.row + 1][pos.col];
    expect(a).not.toBeNull();
    expect(b).toBe(a);
  });
});
