/**
 * Wave 68 leftover after tip/#336 — Kings move-king green cell below. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 68 kings — tutorial move green cell below', () => {
  it('move-king locks tap green cell + one square down', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'move-king');
    expect(step?.message).toContain('tap the green cell');
    expect(step?.message).toContain('directly below your King');
    expect(step?.message).toContain('one square down');
  });
});
