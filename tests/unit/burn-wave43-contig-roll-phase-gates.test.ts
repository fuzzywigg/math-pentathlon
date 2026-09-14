/**
 * Wave 43 TOKENMAXX — Contig doRollDice phase leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { doRollDice } from '../../src/games/contig-60/rules';
import { createInitialState } from '../../src/games/contig-60/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 contig — roll phase', () => {
  it('wrong phase identity; rolling sets dice into calculating', () => {
    const base = createInitialState();
    expect(doRollDice({ ...base, phase: 'calculating' })).toEqual({
      ...base,
      phase: 'calculating',
    });
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const next = doRollDice(base);
    expect(next.currentDice).toEqual([1, 1, 1]);
    expect(next.phase).toBe('calculating');
  });
});
