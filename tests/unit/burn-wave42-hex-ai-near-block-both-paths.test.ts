/**
 * Wave 42 — Hex AI evaluates when both path distances finite midgame.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { getValidMoves } from '../../src/games/hex/rules';
import { getBestMove } from '../../src/games/hex/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 Hex AI — finite path midgame', () => {
  it('medium returns legal move on sparse 5×5', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = {
      ...createInitialState(5),
      board: [
        ['player1', null, null, null, null],
        [null, 'player2', null, null, null],
        [null, null, null, null, null],
        [null, null, null, 'player1', null],
        [null, null, null, null, 'player2'],
      ] as ReturnType<typeof createInitialState>['board'],
      currentPlayer: 'player1' as const,
      moveHistory: [
        { player: 'player1' as const, position: { row: 0, col: 0 }, moveNumber: 1 },
        { player: 'player2' as const, position: { row: 1, col: 1 }, moveNumber: 2 },
        { player: 'player1' as const, position: { row: 3, col: 3 }, moveNumber: 3 },
        { player: 'player2' as const, position: { row: 4, col: 4 }, moveNumber: 4 },
      ],
    };
    const move = getBestMove(state, 'player1', 'medium');
    expect(
      getValidMoves(state).some((m) => m.row === move!.row && m.col === move!.col)
    ).toBe(true);
  });
});
