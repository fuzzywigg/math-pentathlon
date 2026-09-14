/**
 * Overnight TOKENMAXX — Calla makeMove reject leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { makeMove, canSelectPit } from '../../src/games/calla/rules';

describe('Overnight calla — makeMove reject', () => {
  it('oob / empty / wrong phase identity', () => {
    const s = createInitialState();
    expect(makeMove(s, -1)).toBe(s);
    expect(makeMove(s, 99)).toBe(s);
    expect(canSelectPit(s, 'player1', 0)).toBe(true);
    const empty = { ...s, player1Pits: [0, 0, 0, 0, 0] as number[] };
    expect(makeMove(empty, 0)).toBe(empty);
    const anim = { ...s, phase: 'animating' as const };
    expect(makeMove(anim, 0)).toBe(anim);
  });
});
