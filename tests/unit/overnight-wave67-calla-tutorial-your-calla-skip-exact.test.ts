/**
 * Wave 67 leftover after tip/#316 — Calla your-calla skip-opponent exact.
 * Soft store highlight existed; lock skip sentence leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 67 calla — tutorial your-calla skip exact', () => {
  it('your-calla locks skip-opponent and score stay copy', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'your-calla');
    expect(step?.message).toContain("(You skip over your opponent's Calla)");
    expect(step?.message).toContain(
      "Cubes in your Calla stay there - that's your score!"
    );
    expect(step?.highlightSelector).toBe('.calla-store');
  });
});
