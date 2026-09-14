/**
 * Wave 48 — Calla animating phase rejects select/valids. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { canSelectPit, getValidPits, makeMove } from '../../src/games/calla/rules';

describe('Wave 48 calla — animating rejects', () => {
  it('canSelect/getValid/makeMove are no-ops while animating', () => {
    const s = { ...createInitialState(), phase: 'animating' as const };
    expect(canSelectPit(s, 'player1', 0)).toBe(false);
    expect(getValidPits(s)).toEqual([]);
    expect(makeMove(s, 0)).toBe(s);
  });
});
