/**
 * Wave 68 leftover after tip/#333 — board-intro Calla strong exact.
 * Soft tutorial existed; lock exact leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 68 calla — tutorial board calla strong exact', () => {
  it('board-intro strong-marks Calla big cup', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'board-intro');
    expect(step?.message).toContain('Each player has a <strong>Calla</strong> (big cup) on their right side!');
  });
});
