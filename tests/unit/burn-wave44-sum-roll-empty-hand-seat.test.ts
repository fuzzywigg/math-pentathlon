/**
 * Wave 44 — Sum Dominoes doRollDice empty-hand and seat gates. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { doRollDice, canPlayDomino } from '../../src/games/sum-dominoes/rules';
import {
  CONFIG,
  getDiceSum,
  type Domino,
  type PlacedDomino,
  type SumDominoesState,
} from '../../src/games/sum-dominoes/types';

afterEach(() => vi.restoreAllMocks());

function makeDomino(id: string, face1: number, face2: number, owner: Domino['owner'] = 'player1'): Domino {
  return { id, face1, face2, owner, orientation: 'horizontal' };
}

function emptyBoard(): (PlacedDomino | null)[][] {
  return Array.from({ length: CONFIG.BOARD_SIZE }, () =>
    Array.from({ length: CONFIG.BOARD_SIZE }, () => null)
  );
}

function seedBoard(): (PlacedDomino | null)[][] {
  const board = emptyBoard();
  const seed = makeDomino('seed', 6, 6, null);
  const placed: PlacedDomino = {
    domino: { ...seed, orientation: 'horizontal' },
    position: { row: 5, col: 5 },
    orientation: 'horizontal',
  };
  board[5][5] = placed;
  board[5][6] = placed;
  return board;
}

function rolling(overrides: Partial<SumDominoesState> = {}): SumDominoesState {
  return {
    board: seedBoard(),
    hands: {
      player1: [makeDomino('ok', 0, 0)],
      player2: [makeDomino('p2', 1, 1, 'player2')],
    },
    currentPlayer: 'player1',
    currentDice: null,
    selectedDomino: null,
    phase: 'rolling',
    winner: null,
    moveHistory: [],
    passCount: 0,
    ...overrides,
  };
}

describe('Wave 44 sum-dominoes — doRollDice empty-hand / seat', () => {
  it('empty current hand always enters passing', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const state = rolling({ hands: { player1: [], player2: [makeDomino('p2', 1, 1, 'player2')] } });
    const next = doRollDice(state);
    expect(next.phase).toBe('passing');
    expect(next.currentDice).not.toBeNull();
  });

  it('player2 roll uses player2 hand only for playability', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0); // [1,1] sum 2
    const state = rolling({
      currentPlayer: 'player2',
      hands: {
        // player1 could play 0+6 for other sums but not consulted
        player1: [makeDomino('p1', 0, 0)],
        // player2 has 1|1 — for sum 2 needs adjacent 1 or 0? 1+1=2 against face 1, or 1+1 against itself...
        // Against seed 6: 1+6=7 ≠ 2, so cannot play → passing
        player2: [makeDomino('p2', 1, 1, 'player2')],
      },
    });
    const next = doRollDice(state);
    expect(next.currentDice).toEqual([1, 1]);
    const sum = getDiceSum(next.currentDice!);
    const playable = next.hands.player2.some((d) => canPlayDomino(next, d, sum));
    expect(playable).toBe(false);
    expect(next.phase).toBe('passing');
  });

  it('playable hand with forced matching sum enters placing', () => {
    // die faces from random: 0 → 1, so [1,1]. Use a tile that matches sum 7 against 6 instead.
    vi.spyOn(Math, 'random').mockReturnValue(0.5); // floor(0.5*6)+1 = 4 → [4,4] sum 8
    const state = rolling({
      hands: {
        player1: [makeDomino('match', 2, 0)], // 2+6=8
        player2: [],
      },
    });
    const next = doRollDice(state);
    expect(next.currentDice).toEqual([4, 4]);
    expect(canPlayDomino(next, next.hands.player1[0], 8)).toBe(true);
    expect(next.phase).toBe('placing');
  });
});
