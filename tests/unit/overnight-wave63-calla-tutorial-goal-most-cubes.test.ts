/**
 * Wave 63 leftover after tip/#301 — Calla goal most-cubes exact HTML.
 * Tightens wave50 soft /most cubes in your Calla/i. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 63 calla — tutorial goal most cubes', () => {
  it('locks strong most-cubes-in-Calla + game-ends fragment', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'goal');
    expect(step?.title).toBe('How to Win');
    expect(step?.message).toContain(
      'most cubes in your Calla</strong> (your big cup)'
    );
    expect(step?.message).toContain(
      'The game ends when all cubes are collected.'
    );
  });
});
