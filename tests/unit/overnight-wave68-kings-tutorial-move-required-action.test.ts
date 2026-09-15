/**
 * Wave 68 leftover after tip/#336 — Kings move requiredAction click-cell. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 68 kings — tutorial move requiredAction', () => {
  it('move-king requiredAction locks click-cell 2,5', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'move-king');
    expect(step?.requiredAction).toEqual({ type: 'click-cell', row: 2, col: 5 });
    expect(step?.highlightSelector).toBe('.cell[data-row="2"][data-col="5"]');
  });
});
