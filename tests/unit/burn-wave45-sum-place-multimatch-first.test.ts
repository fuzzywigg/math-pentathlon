/**
 * Wave 45 — Sum placeDomino multi-adjacent match uses matches[0]
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
import { selectDomino, placeDomino, isValidPlacement } from '../../src/games/sum-dominoes/rules';


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

describe('Wave 45 Sum rules — multi-match first', () => {
  it('records a deterministic matchedFace when two adjacent faces both sum', () => {
    // Two 3-3 seeds so a 5-5 tile can match both if placed between them with sum 8.
    const board = emptyBoard();
    const a: PlacedDomino = {
      domino: { ...makeDomino('a', 3, 3, null), orientation: 'horizontal' },
      position: { row: 5, col: 3 },
      orientation: 'horizontal',
    };
    const b: PlacedDomino = {
      domino: { ...makeDomino('b', 3, 3, null), orientation: 'horizontal' },
      position: { row: 5, col: 7 },
      orientation: 'horizontal',
    };
    board[5][3] = a; board[5][4] = a;
    board[5][7] = b; board[5][8] = b;
    const tile = makeDomino('t', 5, 5, 'player2');
    let state: SumDominoesState = {
      board,
      hands: { player1: [], player2: [tile] },
      currentPlayer: 'player2',
      currentDice: [3, 5],
      selectedDomino: null,
      phase: 'placing',
      winner: null,
      moveHistory: [],
      passCount: 0,
    };
    // Place horizontally at (5,5)-(5,6): left adj (5,4) face 3; right adj (5,7) face 3
    expect(isValidPlacement(state, tile, { row: 5, col: 5 }, 'horizontal', 8)).toBe(true);
    state = selectDomino(state, 't');
    const next = placeDomino(state, { row: 5, col: 5 }, 'horizontal');
    expect(next.moveHistory).toHaveLength(1);
    expect(next.moveHistory[0].matchedFace).toBe(5);
    expect(next.moveHistory[0].adjacentFace).toBe(3);
    expect(next.moveHistory[0].diceSum).toBe(8);
  });
});
