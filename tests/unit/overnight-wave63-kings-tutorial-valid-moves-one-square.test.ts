/**
 * Wave 63 leftover after #301 — Kings valid-moves one-square direction residual. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 63 kings — tutorial valid-moves one-square', () => {
  it('valid-moves one square in any direction sentence', () => {
    const valid = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'valid-moves');
    expect(valid?.message).toMatch(/one square in any direction/);
    expect(valid?.title).toBe('Valid Moves');
  });
});
