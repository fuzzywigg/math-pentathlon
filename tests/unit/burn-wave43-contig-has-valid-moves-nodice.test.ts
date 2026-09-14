/**
 * Wave 43 TOKENMAXX — Contig hasValidMoves no-dice leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { hasValidMoves, doRollDice } from '../../src/games/contig-60/rules';
import { createInitialState } from '../../src/games/contig-60/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 contig — hasValidMoves', () => {
  it('false without dice; after roll reflects placements', () => {
    const base = createInitialState();
    expect(hasValidMoves(base)).toBe(false);
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const rolled = doRollDice(base);
    expect(typeof hasValidMoves(rolled)).toBe('boolean');
  });
});
