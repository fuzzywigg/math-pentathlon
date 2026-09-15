/**
 * Wave 68 leftover after tip/#334 — Kings move one-square-down exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 68 kings — tutorial move one square down', () => {
  it('move-king locks one square down + cue cell exact', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'move-king');
    expect(step?.message).toContain('one square down');
    expect(step?.message).toContain('directly below your King');
    expect(step?.highlightSelector).toBe('.cell[data-row="2"][data-col="5"]');
    expect(step?.position).toBe('bottom');
  });
});
