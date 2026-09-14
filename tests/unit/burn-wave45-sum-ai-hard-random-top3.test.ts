/**
 * Wave 45 — Sum AI hard randomness top-3 still legal
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

describe('Wave 45 Sum AI — hard random top3', () => {
  it('hard with random<0.03 still picks a legal placement', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);
    const state: SumDominoesState = {
      board: seedAt(5, 5, 6, 6),
      hands: {
        player1: [],
        player2: [
          makeDomino('a', 6, 5, 'player2'),
          makeDomino('b', 6, 4, 'player2'),
          makeDomino('c', 6, 3, 'player2'),
        ],
      },
      currentPlayer: 'player2',
      currentDice: [6, 6],
      selectedDomino: null,
      phase: 'placing',
      winner: null,
      moveHistory: [],
      passCount: 0,
    };
    const move = getAIMove(state, 'player2', 'hard');
    expect(move).not.toBeNull();
    const domino = state.hands.player2.find((d) => d.id === move!.dominoId)!;
    const legal = getValidPlacements(state, domino, 12);
    expect(legal.some((p) => p.position.row === move!.position.row && p.position.col === move!.position.col && p.orientation === move!.orientation)).toBe(true);
  });
});
