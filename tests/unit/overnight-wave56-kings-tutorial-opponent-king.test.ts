/**
 * Wave 56 leftover after #256 — Kings tutorial opponent-king highlight. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 56 kings — tutorial opponent', () => {
  it('opponent-king title and bottom-center highlight', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'opponent-king');
    expect(step?.title).toBe("Opponent's King");
    expect(step?.highlightSelector).toBe('.cell[data-row="9"][data-col="5"]');
    expect(step?.message).toMatch(/Player 2's King/);
    expect(step?.position).toBe('top');
  });
});
