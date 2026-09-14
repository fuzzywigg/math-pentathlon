/**
 * Overnight TOKENMAXX — Hex getRandomMove membership leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { getValidMoves, makeMove } from '../../src/games/hex/rules';
import { getRandomMove } from '../../src/games/hex/ai';

afterEach(() => vi.restoreAllMocks());

describe('Overnight hex — random move', () => {
  it('member of valids; null when full/winner', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const s = createInitialState(3);
    const move = getRandomMove(s);
    expect(move).not.toBeNull();
    expect(
      getValidMoves(s).some((m) => m.row === move!.row && m.col === move!.col)
    ).toBe(true);

    let won = s;
    won = makeMove(won, { row: 0, col: 1 });
    won = makeMove(won, { row: 0, col: 0 });
    won = makeMove(won, { row: 1, col: 1 });
    won = makeMove(won, { row: 0, col: 2 });
    won = makeMove(won, { row: 2, col: 1 });
    expect(getRandomMove(won)).toBeNull();
  });
});
