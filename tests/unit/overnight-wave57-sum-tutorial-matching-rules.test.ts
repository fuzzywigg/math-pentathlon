/**
 * Wave 57 leftover after #267 — Sum matching-rules tutorial copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 57 sum — tutorial matching rules', () => {
  it('pins rolled-8 example + board highlight + top', () => {
    const step = sumDominoesTutorial.steps.find((s) => s.id === 'matching-rules');
    expect(step?.title).toBe('Matching Rules');
    expect(step?.position).toBe('top');
    expect(step?.highlightSelector).toBe('.sd-board');
    expect(step?.message).toMatch(/You rolled 8/);
    expect(step?.message).toMatch(/\[3\|5\]/);
  });
});
