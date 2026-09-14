/**
 * Wave 63 leftover after tip/#301 — Calla how-to-move walking-around copy.
 * Complements wave60 Drop 1 cube / Click a pit. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 63 calla — tutorial walking around', () => {
  it('locks walking-around / giving out one cube fragment', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'how-to-move');
    expect(step?.message).toContain(
      'walking around and giving out one cube at a time'
    );
    expect(step?.position).toBe('center');
  });
});
