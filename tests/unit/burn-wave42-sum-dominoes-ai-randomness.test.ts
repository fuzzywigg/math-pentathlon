/**
 * Wave 42 — Sum Dominoes AI medium randomness top-3.
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

describe('Wave 42 Sum Dominoes AI — randomness', () => {
  it('medium with low random still legal', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.05);
    const state: SumDominoesState = {
      board: seedCenter(),
      hands: {
        player1: [],
        player2: [
          makeDomino('a', 6, 5, 'player2'),
          makeDomino('b', 2, 3, 'player2'),
          makeDomino('c', 4, 4, 'player2'),
        ],
      },
      currentPlayer: 'player2',
      currentDice: [3, 5],
      selectedDomino: null,
      phase: 'placing',
      winner: null,
      moveHistory: [],
      passCount: 0,
    };
    const move = getAIMove(state, 'player2', 'medium');
    expect(move).not.toBeNull();
    const domino = state.hands.player2.find((d) => d.id === move!.dominoId)!;
    expect(getValidPlacements(state, domino, 8).length).toBeGreaterThan(0);
  });
});
