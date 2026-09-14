/**
 * Wave 42 — Hex AI player2 blocks player1 top-bottom threat.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { getBestMove } from '../../src/games/hex/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 Hex AI — P2 blocks P1', () => {
  it('hard blocks finishing cell on col 0', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = {
      ...createInitialState(3),
      board: [
        ['player1', 'player2', null],
        ['player1', null, 'player2'],
        [null, 'player2', null],
      ] as ReturnType<typeof createInitialState>['board'],
      currentPlayer: 'player2' as const,
      moveHistory: [
        { player: 'player1' as const, position: { row: 0, col: 0 }, moveNumber: 1 },
        { player: 'player2' as const, position: { row: 0, col: 1 }, moveNumber: 2 },
        { player: 'player1' as const, position: { row: 1, col: 0 }, moveNumber: 3 },
        { player: 'player2' as const, position: { row: 1, col: 2 }, moveNumber: 4 },
      ],
    };
    expect(getBestMove(state, 'player2', 'hard')).toEqual({ row: 2, col: 0 });
  });
});
