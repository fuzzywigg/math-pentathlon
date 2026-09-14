/**
 * Wave 42 — Sum Dominoes AI high-pip (≥10) scoring branch.
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
function makeDomino(id: string, face1: number, face2: number, owner: Domino['owner'] = 'player1'): Domino {
  return { id, face1, face2, owner, orientation: 'horizontal' };
}
function seedCenter() {
  const board = emptyBoard();
  const placed: PlacedDomino = {
    domino: { ...makeDomino('seed', 6, 6, null), orientation: 'horizontal' },
    position: { row: 5, col: 5 },
    orientation: 'horizontal',
  };
  board[5][5] = placed;
  board[5][6] = placed;
  return board;
}

describe('Wave 42 Sum Dominoes AI — high pip', () => {
  it('hard prefers 6-5 (≥10 pips) over lower when both playable', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const high = makeDomino('hi', 6, 5, 'player2'); // pip 11
    const low = makeDomino('lo', 2, 1, 'player2'); // may not play on sum 8 vs 6-seed
    // sum 8 vs face 6 → need face 2; so use 2-6 and 6-5 both with a 2 or matching
    // Against 6-seed sum 12: need face 6. Use 6-5 and 6-0 → both playable
    const state: SumDominoesState = {
      board: seedCenter(),
      hands: {
        player1: [],
        player2: [makeDomino('lo2', 6, 1, 'player2'), high],
      },
      currentPlayer: 'player2',
      currentDice: [6, 6], // sum 12
      selectedDomino: null,
      phase: 'placing',
      winner: null,
      moveHistory: [],
      passCount: 0,
    };
    const move = getAIMove(state, 'player2', 'hard');
    expect(move?.dominoId).toBe('hi');
  });
});
