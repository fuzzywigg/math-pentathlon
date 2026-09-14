/**
 * Wave 45 — Sum Dominoes AI execute roll→place happy path
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
function seedCenter(): (PlacedDomino | null)[][] {
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

describe('Wave 45 Sum AI — execute roll→place', () => {
  it('rolls a playable sum and places, flipping seat with history', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99); // dice → 6,6 sum 12
    const state: SumDominoesState = {
      board: seedCenter(),
      hands: {
        player1: [makeDomino('p1', 1, 1)],
        player2: [
          makeDomino('t', 6, 5, 'player2'),
          makeDomino('keep', 1, 0, 'player2'),
        ],
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
    expect(next.moveHistory).toHaveLength(1);
    expect(next.moveHistory[0].diceSum).toBe(12);
    expect(next.currentPlayer).toBe('player1');
    expect(next.phase).toBe('rolling');
    expect(next.hands.player2).toHaveLength(1);
  });
});
