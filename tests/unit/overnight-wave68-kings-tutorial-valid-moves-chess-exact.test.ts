/**
 * Wave 68 leftover after tip/#334 — Kings valid-moves chess copy exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 68 kings — tutorial valid moves chess', () => {
  it('valid-moves locks Kings move like in chess exact', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'valid-moves');
    expect(step?.message).toContain('Kings move like in chess');
    expect(step?.message).toContain('horizontally, vertically, or diagonally');
    expect(step?.title).toBe('Valid Moves');
  });
});
