/**
 * Wave 67 leftover after tip/#323/#324 — board blue span exact.
 * Soft tutorial existed; lock exact leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 67 calla — tutorial board blue span exact', () => {
  it('board-intro strong-marks Blue pits span', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'board-intro');
    expect(step?.message).toContain('<span style="color: #2196F3">Blue\'s pits</span>');
  });
});
