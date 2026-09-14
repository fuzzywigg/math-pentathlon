/**
 * Wave 64 leftover after tip/#303 — Calla how-to-move pick-up / Drop 1 cube.
 * Wave63 locked walking-around; deepen ol step leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 64 calla — tutorial move picked up', () => {
  it('locks Click a pit / Cubes get picked up / Drop 1 cube steps', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'how-to-move');
    expect(step?.title).toBe('Making a Move');
    expect(step?.message).toContain('Click a pit');
    expect(step?.message).toContain('Cubes get picked up');
    expect(step?.message).toContain('Drop 1 cube');
    expect(step?.message).toContain('counter-clockwise');
  });
});
