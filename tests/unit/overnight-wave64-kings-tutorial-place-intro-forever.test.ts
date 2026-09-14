/**
 * Wave 64 leftover after tip/#303 — Kings place-intro Excellent move / forever block. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 64 kings — tutorial place-intro forever', () => {
  it('Excellent move; stay forever; block all movement', () => {
    const intro = kingsQuadraphagesTutorial.steps.find(
      (s) => s.id === 'place-quadraphage-intro'
    );
    expect(intro?.message).toMatch(/Excellent move!/);
    expect(intro?.message).toMatch(/stay on the board forever/);
    expect(intro?.message).toMatch(/block all movement through that square/);
  });
});
