/**
 * Wave 45 — Contig doRollDice identity outside rolling
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { doRollDice } from '../../src/games/contig-60/rules';

describe('Wave 45 Contig — roll identity outside', () => {
  it('returns same reference for calculating and gameOver', () => {
    const calc = {
      ...createInitialState(),
      phase: 'calculating' as const,
      currentDice: [1, 2, 3] as [number, number, number],
    };
    const over = { ...createInitialState(), phase: 'gameOver' as const, winner: 'player1' as const };
    expect(doRollDice(calc)).toBe(calc);
    expect(doRollDice(over)).toBe(over);
  });
});
