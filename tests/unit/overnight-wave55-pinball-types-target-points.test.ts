/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Pinball TARGET_POINTS / INITIAL_BALLS leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  TARGET_POINTS,
  INITIAL_BALLS,
  MAX_ROUNDS,
  createInitialState,
} from '../../src/games/fraction-pinball/types';

describe('Wave 55 pinball types — constants', () => {
  it('keeps 5 balls / 10 rounds / target ladder leftover', () => {
    expect(INITIAL_BALLS).toBe(5);
    expect(MAX_ROUNDS).toBe(10);
    expect(TARGET_POINTS).toEqual([10, 20, 30, 50, 100]);
    const s = createInitialState();
    expect(s.targets.map((t) => t.value)).toEqual(TARGET_POINTS);
    expect(s.targets.every((t) => t.hit === false)).toBe(true);
    expect(s.targets[0].id).toBe('target-0');
  });
});
