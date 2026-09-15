/**
 * Wave 68 leftover after tip/#336 — Kings select requiredAction click-cell. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 68 kings — tutorial select requiredAction', () => {
  it('select-king requiredAction locks click-cell 1,5', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'select-king');
    expect(step?.requiredAction).toEqual({ type: 'click-cell', row: 1, col: 5 });
    expect(step?.highlightSelector).toBe('.cell[data-row="1"][data-col="5"]');
  });
});
