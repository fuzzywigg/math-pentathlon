/**
 * Wave 47 leftover after #214/#215 — Sum Dominoes easy teaching fallthrough to best move.
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

describe('Wave 47 sum deepen 11 — Sum Dominoes AI — easy best fallback', () => {
  it('easy random≥0.4 returns a legal placement', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.55);
    const state: SumDominoesState = {
      board: seedCenter(),
      hands: {
        player1: [],
        player2: [
          makeDomino('a', 6, 5, 'player2'),
          makeDomino('b', 2, 3, 'player2'),
        ],
      },
      currentPlayer: 'player2',
      currentDice: [2, 6],
      selectedDomino: null,
      phase: 'placing',
      winner: null,
      moveHistory: [],
      passCount: 0,
    };
    const move = getAIMove(state, 'player2', 'easy');
    expect(move).not.toBeNull();
    const domino = state.hands.player2.find((d) => d.id === move!.dominoId)!;
    expect(getValidPlacements(state, domino, 8).length).toBeGreaterThan(0);
  });
});
