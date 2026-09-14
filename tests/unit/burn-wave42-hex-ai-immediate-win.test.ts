/**
 * Wave 42 — Hex AI immediate-win Infinity path.
 * Distinct from wave41 hex rules. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { makeMove } from '../../src/games/hex/rules';
import { getBestMove } from '../../src/games/hex/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 Hex AI — immediate win', () => {
  it('hard takes the finishing top-bottom cell', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = {
      ...createInitialState(3),
      board: [
        ['player1', null, 'player2'],
        ['player1', 'player2', null],
        [null, null, 'player2'],
      ] as ReturnType<typeof createInitialState>['board'],
      currentPlayer: 'player1' as const,
      moveHistory: [
        { player: 'player1' as const, position: { row: 0, col: 0 }, moveNumber: 1 },
        { player: 'player2' as const, position: { row: 0, col: 2 }, moveNumber: 2 },
        { player: 'player1' as const, position: { row: 1, col: 0 }, moveNumber: 3 },
        { player: 'player2' as const, position: { row: 1, col: 1 }, moveNumber: 4 },
        { player: 'player1' as const, position: { row: 2, col: 2 }, moveNumber: 5 },
      ],
    };
    const move = getBestMove(state, 'player1', 'hard');
    expect(move).toEqual({ row: 2, col: 0 });
    const next = makeMove(state, move!);
    expect(next.winner).toBe('player1');
  });
});
