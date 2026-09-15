/**
 * Wave 65 leftover after tip/#313 — Kings place limit-movement tip. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 65 kings — tutorial place limit movement', () => {
  it("limit your opponent's movement options", () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'place-quadraphage');
    expect(step?.message).toMatch(/limit your\s*opponent's movement/);
  });
});
