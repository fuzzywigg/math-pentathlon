/**
 * Wave 56 leftover after #243 — Sum Dominoes tutorial setup/matching residual.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 56 sum — tutorial setup matching', () => {
  it('keeps setup board highlight and matching 3+5=8 example', () => {
    const byId = Object.fromEntries(sumDominoesTutorial.steps.map((s) => [s.id, s]));
    expect(byId['setup']?.highlightSelector).toBe('.sd-board');
    expect(byId['matching-rules']?.message).toContain('3+5=8');
  });
});
