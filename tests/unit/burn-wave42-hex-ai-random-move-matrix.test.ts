/**
 * Wave 42 — Hex getRandomMove deterministic picks + coverage.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { getValidMoves } from '../../src/games/hex/rules';
import { getRandomMove } from '../../src/games/hex/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 Hex AI — getRandomMove matrix', () => {
  it('random=0 picks first valid; random near 1 picks lastish', () => {
    const state = createInitialState(3);
    const valids = getValidMoves(state);
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(getRandomMove(state)).toEqual(valids[0]);
    vi.restoreAllMocks();
    vi.spyOn(Math, 'random').mockReturnValue(0.999);
    const last = getRandomMove(state);
    expect(valids).toEqual(expect.arrayContaining([expect.objectContaining(last!)]));
  });
});
