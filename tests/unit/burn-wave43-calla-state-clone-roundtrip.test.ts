/**
 * Wave 43 — structuredClone post-move roundtrip leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { makeMove } from '../../src/games/calla/rules';

describe('Wave 43 calla — clone roundtrip', () => {
  it('structuredClone preserves pits/history after makeMove', () => {
    const next = makeMove(createInitialState(), 2);
    const cloned = structuredClone(next);
    expect(cloned.player1Pits).toEqual(next.player1Pits);
    expect(cloned.player2Pits).toEqual(next.player2Pits);
    expect(cloned.moveHistory).toEqual(next.moveHistory);
    expect(cloned.winner).toBe(next.winner);
  });
});
