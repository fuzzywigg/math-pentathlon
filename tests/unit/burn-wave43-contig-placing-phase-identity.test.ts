/**
 * Wave 43 — Contig unused placing phase mutator identities. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { placeChip, passTurn, doRollDice } from '../../src/games/contig-60/rules';

describe('Wave 43 contig — placing phase identity', () => {
  it('placeChip/passTurn/doRollDice identity on placing', () => {
    const state = {
      ...createInitialState(),
      phase: 'placing' as const,
      currentDice: [2, 3, 4] as [number, number, number],
    };
    expect(placeChip(state, 1, '1+2-2')).toBe(state);
    expect(passTurn(state)).toBe(state);
    expect(doRollDice(state)).toBe(state);
  });
});
