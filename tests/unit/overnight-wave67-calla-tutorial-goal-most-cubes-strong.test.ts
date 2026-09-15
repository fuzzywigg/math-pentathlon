/**
 * Wave 67 leftover after tip/#316 — Calla goal most-cubes strong exact.
 * Soft How to Win existed; lock strong markup + end sentence leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 67 calla — tutorial goal most cubes strong', () => {
  it('goal strong-marks most cubes and ends-when collected', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'goal');
    expect(step?.title).toBe('How to Win');
    expect(step?.message).toContain(
      'get the <strong>most cubes in your Calla</strong>'
    );
    expect(step?.message).toContain(
      'The game ends when all cubes are collected.'
    );
  });
});
