/**
 * Wave 42 — Hex AI blocks opponent immediate L-R win.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { getBestMove } from '../../src/games/hex/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 Hex AI — block opponent', () => {
  it('hard blocks player2 left-right threat', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = {
      ...createInitialState(3),
      board: [
        ['player2', 'player2', null],
        ['player1', 'player1', null],
        [null, null, 'player1'],
      ] as ReturnType<typeof createInitialState>['board'],
      currentPlayer: 'player1' as const,
      moveHistory: [
        { player: 'player2' as const, position: { row: 0, col: 0 }, moveNumber: 1 },
        { player: 'player1' as const, position: { row: 1, col: 0 }, moveNumber: 2 },
        { player: 'player2' as const, position: { row: 0, col: 1 }, moveNumber: 3 },
      ],
    };
    expect(getBestMove(state, 'player1', 'hard')).toEqual({ row: 0, col: 2 });
  });
});
