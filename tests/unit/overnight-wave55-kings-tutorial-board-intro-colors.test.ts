/**
 * Wave 55 leftover after #250 — Kings board-intro colors + king highlight cells. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 55 kings — tutorial board intro', () => {
  it('quotes 9x9 board colors and king cells', () => {
    const intro = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'board-intro');
    expect(intro?.message).toMatch(/9&times;9/);
    expect(intro?.message).toMatch(/#2196F3/);
    expect(intro?.message).toMatch(/#e53935/);
    expect(intro?.highlightSelector).toBe('.board');
    const yours = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'your-king');
    expect(yours?.highlightSelector).toBe('.cell[data-row="1"][data-col="5"]');
    const opp = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'opponent-king');
    expect(opp?.highlightSelector).toBe('.cell[data-row="9"][data-col="5"]');
    expect(opp?.position).toBe('top');
  });
});
