/**
 * Wave 67 leftover after tip/#316 — Calla move Drop-1 strong exact li.
 * Wave66 locked Click-a-pit YOUR side; lock Drop 1 cube strong li leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 67 calla — tutorial move drop strong exact', () => {
  it('how-to-move strong-marks Drop 1 cube li', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'how-to-move');
    expect(step?.message).toContain(
      '<li><strong>Drop 1 cube</strong> in each pit going counter-clockwise</li>'
    );
    expect(step?.message).toContain(
      '<li><strong>Cubes get picked up</strong> from that pit</li>'
    );
  });
});
