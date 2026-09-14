/**
 * Wave 45 — Contig rollDice three-face bounds via random extremes
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { rollDice } from '../../src/games/contig-60/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 45 Contig — rollDice tuple bounds', () => {
  it('maps random 0→1 and ~1→6 for all three dice', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(rollDice()).toEqual([1, 1, 1]);
    vi.spyOn(Math, 'random').mockReturnValue(0.999);
    const hi = rollDice();
    expect(hi).toEqual([6, 6, 6]);
    expect(hi).toHaveLength(3);
  });
});
