/**
 * Wave 63 leftover after tip/#301 — Calla pits-explained 3-cubes exact.
 * Soft /3 cubes/ existed elsewhere; lock tutorial HTML. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 63 calla — tutorial pits three cubes', () => {
  it('locks Each pit starts with strong 3 cubes fragment', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'pits-explained');
    expect(step?.message).toContain(
      'Each pit starts with <strong>3 cubes</strong>'
    );
    expect(step?.highlightSelector).toBe('.calla-pit');
    expect(step?.position).toBe('top');
  });
});
