/**
 * Wave 60 leftover after tip/#279 — Calla tutorial skip-opponent calla copy.
 * Distinct from wave59 strategy/complete. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 60 calla — tutorial skip opponent', () => {
  it('your-calla step mentions skip over opponent Calla', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'your-calla');
    expect(step?.message).toContain("skip over your opponent's Calla");
  });
});
