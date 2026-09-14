/**
 * Wave 42 — Sum Dominoes AI null when no hand complement matches.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  SumDominoesState,
  Domino,
  PlacedDomino,
  CONFIG,
} from '../../src/games/sum-dominoes/types';
import { getAIMove, hasPlayableMove, executeAITurn } from '../../src/games/sum-dominoes/ai';

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

describe('Wave 42 Sum Dominoes AI — no playable', () => {
  it('getAIMove null and hasPlayableMove false for impossible sum', () => {
    const state: SumDominoesState = {
      board: seedCenter(),
      hands: {
        player1: [],
        player2: [makeDomino('x', 1, 1, 'player2')],
      },
      currentPlayer: 'player2',
      currentDice: [6, 6], // sum 12 — 1+1 cannot play against 6-6 seed typically
      selectedDomino: null,
      phase: 'placing',
      winner: null,
      moveHistory: [],
      passCount: 0,
    };
    expect(hasPlayableMove(state, 'player2', 12)).toBe(false);
    expect(getAIMove(state, 'player2', 'hard')).toBeNull();
  });

  it('executeAITurn from rolling advances without throwing', () => {
    const state: SumDominoesState = {
      board: seedCenter(),
      hands: {
        player1: [makeDomino('p1', 2, 6)],
        player2: [makeDomino('p2', 2, 6, 'player2')],
      },
      currentPlayer: 'player2',
      currentDice: null,
      selectedDomino: null,
      phase: 'rolling',
      winner: null,
      moveHistory: [],
      passCount: 0,
    };
    const next = executeAITurn(state, 'player2', 'hard');
    expect(['rolling', 'placing', 'passing', 'gameOver']).toContain(next.phase);
  });
});
