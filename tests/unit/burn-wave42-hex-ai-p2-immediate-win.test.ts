/**
 * Wave 42 — Hex AI player2 finishes left-right connection.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { makeMove } from '../../src/games/hex/rules';
import { getBestMove } from '../../src/games/hex/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 Hex AI — player2 immediate win', () => {
  it('hard completes L-R on row 0', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = {
      ...createInitialState(3),
      board: [
        ['player2', 'player2', null],
        ['player1', null, 'player1'],
        [null, 'player1', null],
      ] as ReturnType<typeof createInitialState>['board'],
      currentPlayer: 'player2' as const,
      moveHistory: [
        { player: 'player1' as const, position: { row: 1, col: 0 }, moveNumber: 1 },
        { player: 'player2' as const, position: { row: 0, col: 0 }, moveNumber: 2 },
        { player: 'player1' as const, position: { row: 1, col: 2 }, moveNumber: 3 },
        { player: 'player2' as const, position: { row: 0, col: 1 }, moveNumber: 4 },
      ],
    };
    const move = getBestMove(state, 'player2', 'hard');
    expect(move).toEqual({ row: 0, col: 2 });
    expect(makeMove(state, move!).winner).toBe('player2');
  });
});
