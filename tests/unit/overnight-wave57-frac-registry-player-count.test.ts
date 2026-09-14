/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Frac Fact registry playerCount.
 * Wave56 catalog asserted difficulty; playerCount unasserted for frac. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getGameById } from '../../src/core/game-registry';

describe('Wave 57 frac registry — playerCount', () => {
  it('Frac Fact playerCount is 2 Players leftover', () => {
    expect(getGameById('frac-fact')?.playerCount).toBe('2 Players');
  });
});
