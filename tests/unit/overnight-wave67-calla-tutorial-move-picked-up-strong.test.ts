/**
 * Wave 67 leftover after tip/#323/#324 — move picked-up strong exact.
 * Soft tutorial existed; lock exact leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 67 calla — tutorial move picked-up strong', () => {
  it('how-to-move strong-marks Cubes get picked up', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'how-to-move');
    expect(step?.message).toContain('<li><strong>Cubes get picked up</strong> from that pit</li>');
  });
});
