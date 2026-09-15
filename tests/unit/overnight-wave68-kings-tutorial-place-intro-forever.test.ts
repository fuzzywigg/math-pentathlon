/**
 * Wave 68 leftover after tip/#336 — Kings place-intro forever blockers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 68 kings — tutorial place intro forever', () => {
  it('place-quadraphage-intro locks forever + place strong', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'place-quadraphage-intro');
    expect(step?.message).toContain('<strong>place a Quadraphage</strong>');
    expect(step?.message).toContain('stay on the board forever');
    expect(step?.title).toBe('Step 2: Place a Quadraphage');
  });
});
