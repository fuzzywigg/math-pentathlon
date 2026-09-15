/**
 * Wave 68 leftover after tip/#334 — Kings opponent bottom-center start exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 68 kings — tutorial opponent bottom center', () => {
  it('opponent-king locks bottom center start copy exact', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'opponent-king');
    expect(step?.message).toContain("Your opponent's King starts at the bottom center");
    expect(step?.highlightSelector).toBe('.cell[data-row="9"][data-col="5"]');
  });
});
