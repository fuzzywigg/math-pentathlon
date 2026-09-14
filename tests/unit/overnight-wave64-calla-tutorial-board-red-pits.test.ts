/**
 * Wave 64 leftover after tip/#303 — Calla board-intro Red pits / two-rows copy.
 * Wave62 locked Blue/#2196F3; deepen Red side leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 64 calla — tutorial board red pits', () => {
  it('locks two rows / Red pits / right-side Calla fragments', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'board-intro');
    expect(step?.title).toBe('The Game Board');
    expect(step?.message).toContain('two rows of pits');
    expect(step?.message).toContain("Red's pits");
    expect(step?.message).toContain('on their right side');
    expect(step?.highlightSelector).toBe('.calla-board');
  });
});
