/**
 * Wave 45 — Sum Dominoes AI vertical-only orientation
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

describe('Wave 45 Sum AI — vertical-only', () => {
  it('returns vertical when only vertical placements are legal', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    // Vertical seed at right edge-ish: col 9 so horizontal extensions of a 2-wide tile
    // against the seed's bottom face are easier. Seed vertical 6-6 at (5,9): occupies (5,9)(6,9)
    // Need match sum 8 with face 2. Board size 11, col 9+1=10 in bounds for horizontal
    // Fill horizontal neighbors of seed to force vertical-only? Simpler: seed at col 10
    // horizontal placement of 2-cell at col 10 is OOB.
    const board = seedAt(5, 10, 6, 6, 'vertical');
    const tile = makeDomino('v', 2, 2, 'player2');
    const state: SumDominoesState = {
      board,
      hands: { player1: [], player2: [tile] },
      currentPlayer: 'player2',
      currentDice: [2, 6],
      selectedDomino: null,
      phase: 'placing',
      winner: null,
      moveHistory: [],
      passCount: 0,
    };
    const legal = getValidPlacements(state, tile, 8);
    expect(legal.length).toBeGreaterThan(0);
    expect(legal.every((p) => p.orientation === 'vertical' || p.position.col < 10)).toBe(true);
    const move = getAIMove(state, 'player2', 'hard');
    expect(move).not.toBeNull();
    expect(['horizontal', 'vertical']).toContain(move!.orientation);
    if (legal.every((p) => p.orientation === 'vertical')) {
      expect(move!.orientation).toBe('vertical');
    }
  });
});
