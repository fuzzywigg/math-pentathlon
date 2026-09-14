/**
 * Wave 45 — Sum executeAITurn roll then forced pass
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

describe('Wave 45 Sum AI — execute roll→pass', () => {
  it('unplayable roll from rolling ends as opponent rolling with passCount 1', () => {
    // Force dice to [1,1] sum 2 — against 6-6 seed need face -4 impossible
    vi.spyOn(Math, 'random').mockReturnValue(0); // rollDice → 1,1
    const state: SumDominoesState = {
      board: seedAt(5, 5, 6, 6),
      hands: { player1: [makeDomino('p1', 1, 1)], player2: [makeDomino('t', 6, 5, 'player2')] },
      currentPlayer: 'player2',
      currentDice: null,
      selectedDomino: null,
      phase: 'rolling',
      winner: null,
      moveHistory: [],
      passCount: 0,
    };
    const next = executeAITurn(state, 'player2', 'hard');
    expect(next.passCount).toBe(1);
    expect(next.currentPlayer).toBe('player1');
    expect(next.phase).toBe('rolling');
    expect(next.moveHistory).toHaveLength(0);
  });
});
