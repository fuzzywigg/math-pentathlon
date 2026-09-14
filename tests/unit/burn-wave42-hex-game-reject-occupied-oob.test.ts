/**
 * Wave 42 — Hex game move reject OOB/occupied/post-win. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  makeMove,
  isValidMove,
  isValidPosition,
  isCellEmpty,
  getValidMoves,
} from '../../src/games/hex/rules';
import { createInitialState } from '../../src/games/hex/types';

describe('Wave 42 hex-game — reject matrix', () => {
  it('OOB and occupied reject identity', () => {
    let s = createInitialState(5);
    expect(isValidPosition({ row: -1, col: 0 }, 5)).toBe(false);
    expect(isValidMove(s, { row: 5, col: 0 })).toBe(false);
    expect(makeMove(s, { row: -1, col: 0 })).toBe(s);
    s = makeMove(s, { row: 2, col: 2 });
    expect(isCellEmpty(s.board, { row: 2, col: 2 })).toBe(false);
    expect(makeMove(s, { row: 2, col: 2 })).toBe(s);
  });

  it('post-win no valid moves', () => {
    const s = {
      ...createInitialState(3),
      winner: 'player2' as const,
    };
    expect(getValidMoves(s)).toEqual([]);
    expect(isValidMove(s, { row: 0, col: 0 })).toBe(false);
  });
});
