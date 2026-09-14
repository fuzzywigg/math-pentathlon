/**
 * Wave 63 leftover after #301 — Kings winning Off the board / Occupied residuals. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 63 kings — tutorial winning off-board', () => {
  it('winning lists Off the board and Occupied by your King', () => {
    const winning = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'winning');
    expect(winning?.message).toMatch(/Off the board \(edge\/corner\)/);
    expect(winning?.message).toMatch(/Occupied by your King/);
  });
});
