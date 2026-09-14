/**
 * Wave 43 — Calla OOB pitIndex identity leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { makeMove, canSelectPit } from '../../src/games/calla/rules';

describe('Wave 43 calla — OOB pit identity', () => {
  it('negative and >=5 pits rejected', () => {
    const s = createInitialState();
    expect(canSelectPit(s, 'player1', -1)).toBe(false);
    expect(canSelectPit(s, 'player1', 5)).toBe(false);
    expect(makeMove(s, -1)).toBe(s);
    expect(makeMove(s, 5)).toBe(s);
  });
});
