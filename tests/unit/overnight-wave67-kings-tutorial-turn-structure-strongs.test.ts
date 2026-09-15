/**
 * Wave 67 leftover after tip/#324 — Kings turn-structure strong labels. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 67 kings — tutorial turn-structure strongs', () => {
  it('turn-structure locks two-parts / Move / Place strongs', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'turn-structure');
    expect(step?.message).toContain('<strong>two parts</strong>');
    expect(step?.message).toContain('<strong>Move your King</strong>');
    expect(step?.message).toContain('<strong>Place a Quadraphage</strong>');
  });
});
