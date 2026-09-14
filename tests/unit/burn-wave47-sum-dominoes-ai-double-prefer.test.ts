/**
 * Wave 47 leftover after #214/#215 — Sum Dominoes AI prefers doubles among equal playable options.
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
function seedCenter() {
  const board = emptyBoard();
  // Seed double-4: adjacent face matches require myFace+4 === targetSum
  const placed: PlacedDomino = {
    domino: { ...makeDomino('seed', 4, 4, null), orientation: 'horizontal' },
    position: { row: 5, col: 5 },
    orientation: 'horizontal',
  };
  board[5][5] = placed;
  board[5][6] = placed;
  return board;
}

describe('Wave 47 sum deepen 10 — Sum Dominoes AI — double prefer', () => {
  it('hard prefers double when both playable for sum', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    // Target 8 against face-4 seed → need a face of 4 on the played tile
    const double = makeDomino('dbl', 4, 4, 'player2');
    const other = makeDomino('oth', 4, 3, 'player2');
    const state: SumDominoesState = {
      board: seedCenter(),
      hands: { player1: [makeDomino('p1', 1, 1)], player2: [other, double] },
      currentPlayer: 'player2',
      currentDice: [4, 4], // sum 8
      selectedDomino: null,
      phase: 'placing',
      winner: null,
      moveHistory: [],
      passCount: 0,
    };
    expect(canPlayDomino(state, double, 8)).toBe(true);
    expect(canPlayDomino(state, other, 8)).toBe(true);
    const move = getAIMove(state, 'player2', 'hard');
    // Double gets +15 bonus; pip count equal (8) — double should win
    expect(move?.dominoId).toBe('dbl');
  });
});
