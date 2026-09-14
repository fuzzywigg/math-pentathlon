/**
 * Wave 45 — Sum getDiceSum bounds 2-12
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { rollDice, getDiceSum } from '../../src/games/sum-dominoes/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 45 Sum types — dice sum bounds', () => {
  it('maps random extremes to sums 2 and 12', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(getDiceSum(rollDice())).toBe(2);
    vi.spyOn(Math, 'random').mockReturnValue(0.999);
    expect(getDiceSum(rollDice())).toBe(12);
  });
});
