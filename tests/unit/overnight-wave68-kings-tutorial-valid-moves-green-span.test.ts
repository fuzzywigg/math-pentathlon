/**
 * Wave 68 leftover after tip/#336 — Kings valid-moves green span exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 68 kings — tutorial valid-moves green span', () => {
  it('valid-moves locks green highlighted cells span + chess any direction', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'valid-moves');
    expect(step?.message).toContain('style="color: green">green highlighted cells</span>');
    expect(step?.message).toContain('one square in any direction');
    expect(step?.title).toBe('Valid Moves');
  });
});
