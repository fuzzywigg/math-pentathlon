/**
 * Wave 67 leftover after tip/#323/#324 — move drop-1 strong exact.
 * Soft tutorial existed; lock exact leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 67 calla — tutorial move drop strong exact', () => {
  it('how-to-move strong-marks Drop 1 cube', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'how-to-move');
    expect(step?.message).toContain('<li><strong>Drop 1 cube</strong> in each pit going counter-clockwise</li>');
  });
});
