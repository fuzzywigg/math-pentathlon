/**
 * Wave 64 leftover after tip/#303 — Kings valid-moves green highlighted cells. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 64 kings — tutorial valid green cells', () => {
  it('green highlighted cells + horizontally/vertically/diagonally', () => {
    const valid = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'valid-moves');
    expect(valid?.message).toMatch(/green highlighted cells/);
    expect(valid?.message).toMatch(/horizontally, vertically, or diagonally/);
  });
});
