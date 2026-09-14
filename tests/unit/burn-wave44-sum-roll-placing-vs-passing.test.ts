/**
 * Wave 44 — Sum Dominoes doRollDice placing/passing leftovers.
 * Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { CONFIG, Domino, PlacedDomino } from '../../src/games/sum-dominoes/types';
import { createInitialState, doRollDice } from '../../src/games/sum-dominoes/rules';

afterEach(() => vi.restoreAllMocks());

function emptyBoard(): (PlacedDomino | null)[][] {
  return Array.from({ length: CONFIG.BOARD_SIZE }, () =>
    Array.from({ length: CONFIG.BOARD_SIZE }, () => null)
  );
}

describe('Wave 44 Sum Dominoes — roll placing vs passing', () => {
  it('wrong phase identity; empty hand forces passing', () => {
    const s0 = createInitialState();
    expect(doRollDice({ ...s0, phase: 'placing' })).toEqual({ ...s0, phase: 'placing' });
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const board = emptyBoard();
    const seed: Domino = {
      id: 'seed',
      face1: 6,
      face2: 6,
      owner: null,
      orientation: 'horizontal',
    };
    const placed: PlacedDomino = {
      domino: seed,
      position: { row: 5, col: 5 },
      orientation: 'horizontal',
    };
    board[5][5] = placed;
    board[5][6] = placed;
    const emptyHand = {
      ...s0,
      board,
      hands: { player1: [], player2: s0.hands.player2 },
      phase: 'rolling' as const,
    };
    const rolled = doRollDice(emptyHand);
    expect(rolled.phase).toBe('passing');
    expect(rolled.currentDice).not.toBeNull();
  });
});
