/**
 * Wave 63 leftover after tip/#301 — Calla your-calla highlight + skip copy.
 * Wave60 locked skip-opponent soft; deepen selector + title. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 63 calla — tutorial highlight store', () => {
  it('locks your-calla highlightSelector and score stay fragment', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'your-calla');
    expect(step?.highlightSelector).toBe('.calla-store');
    expect(step?.position).toBe('left');
    expect(step?.message).toContain(
      "Cubes in your Calla stay there - that's your score!"
    );
  });
});
