/**
 * Wave 63 leftover after tip/#301 — Calla complete start-collecting copy.
 * Wave59 locked Good luck / ice-cube; deepen Finish CTA. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 63 calla — tutorial complete collecting', () => {
  it('locks Finish CTA + start collecting cubes fragment', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.message).toContain(
      'Click <strong>Finish</strong> and start collecting cubes!'
    );
    expect(step?.title).toBe('Ready to Play!');
  });
});
