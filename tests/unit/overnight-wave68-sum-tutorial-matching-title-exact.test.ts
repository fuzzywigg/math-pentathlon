/**
 * Wave 68 leftover after tip/#337 — Sum matching-rules title exact.
 * Soft connect/example exacts existed; lock Matching Rules title leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 68 sum — tutorial matching title', () => {
  it('locks Matching Rules title leftover', () => {
    const step = sumDominoesTutorial.steps.find((s) => s.id === 'matching-rules');
    expect(step?.title).toBe('Matching Rules');
    expect(step?.highlightSelector).toBe('.sd-board');
  });
});
