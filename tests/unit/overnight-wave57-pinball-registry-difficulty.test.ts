/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Pinball registry difficulty.
 * Wave56 catalog asserted playerCount; difficulty unasserted for pinball. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getGameById } from '../../src/core/game-registry';

describe('Wave 57 pinball registry — difficulty', () => {
  it('Fraction Pinball difficulty is intermediate leftover', () => {
    expect(getGameById('fraction-pinball')?.difficulty).toBe('intermediate');
  });
});
