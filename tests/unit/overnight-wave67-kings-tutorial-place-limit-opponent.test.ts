/**
 * Wave 67 leftover after tip/#324 — Kings place strategic tip limit opponent. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 67 kings — tutorial place limit opponent', () => {
  it('place-quadraphage pins limit opponent movement tip', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'place-quadraphage');
    expect(step?.message).toMatch(/limit your\s+opponent's movement options/);
    expect(step?.message).toContain('<strong>Click on any empty cell</strong>');
    expect(step?.highlightSelector).toBe('.board');
  });
});
