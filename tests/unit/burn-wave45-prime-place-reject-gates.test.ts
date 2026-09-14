/**
 * Wave 45 — Prime Gold placeChip reject identity leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, placeChip } from '../../src/games/prime-gold/rules';

describe('Wave 45 prime — place reject', () => {
  it('identity on wrong phase / missing dice / invalid value', () => {
    const rolling = createInitialState();
    expect(placeChip(rolling, 1, '1')).toBe(rolling);
    const placing = { ...rolling, phase: 'placing' as const, diceRoll: { die1: 1, die2: 1, die3: 1 } };
    expect(placeChip(placing, 99, '99')).toBe(placing);
  });
});
