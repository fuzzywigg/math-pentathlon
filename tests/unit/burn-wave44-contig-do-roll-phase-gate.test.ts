/**
 * Wave 44 — Contig doRollDice phase leftovers.
 * Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { doRollDice } from '../../src/games/contig-60/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 44 Contig — doRoll phase gate', () => {
  it('rolling -> calculating with dice; wrong phase identity', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    const s0 = createInitialState();
    const rolled = doRollDice(s0);
    expect(rolled.phase).toBe('calculating');
    expect(rolled.currentDice).toHaveLength(3);
    expect(doRollDice(rolled)).toEqual(rolled);
  });
});
