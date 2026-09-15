/**
 * Wave 67 leftover after tip/#316 — Calla board Blue pits span exact.
 * Wave66 locked Red span; lock Blue span + two-rows leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 67 calla — tutorial board blue span exact', () => {
  it('board-intro locks Blue pits span and two-rows copy', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'board-intro');
    expect(step?.message).toContain(
      '<span style="color: #2196F3">Blue\'s pits</span> are on top.'
    );
    expect(step?.message).toContain(
      'The board has two rows of pits (cups).'
    );
  });
});
