/**
 * Wave 57 leftover after #263 — Kings select-king / move-king requiredAction. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 57 kings — tutorial select/move actions', () => {
  it('select-king and move-king requiredAction coords + Tap cue', () => {
    const select = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'select-king');
    expect(select?.requiredAction).toEqual({
      type: 'click-cell',
      row: 1,
      col: 5,
    });
    expect(select?.message).toMatch(/Tap here/);
    const move = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'move-king');
    expect(move?.requiredAction).toEqual({
      type: 'click-cell',
      row: 2,
      col: 5,
    });
  });
});
