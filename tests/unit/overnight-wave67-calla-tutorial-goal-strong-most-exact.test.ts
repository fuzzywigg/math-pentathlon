/**
 * Wave 67 leftover after tip/#323/#324 — goal strong most cubes exact.
 * Soft tutorial existed; lock exact leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 67 calla — tutorial goal strong most exact', () => {
  it('goal strong-marks most cubes in Calla', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'goal');
    expect(step?.message).toContain('<strong>most cubes in your Calla</strong>');
    expect(step?.title).toBe('How to Win');
  });
});
