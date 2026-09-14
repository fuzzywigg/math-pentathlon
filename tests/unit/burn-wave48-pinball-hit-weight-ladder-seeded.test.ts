/**
 * Wave 48 — Pinball hitRandomTarget seeded first bucket. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { hitRandomTarget } from '../../src/games/fraction-pinball/rules';
import { createInitialState, TARGET_POINTS } from '../../src/games/fraction-pinball/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 48 pinball — hit seeded', () => {
  it('random 0 picks first weight bucket (lowest points)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const { points } = hitRandomTarget(createInitialState().targets);
    expect(points).toBe(TARGET_POINTS[0]);
  });
});
