/**
 * Wave 66 leftover after tip/#316 — Kings place-quadraphage limit-movement exact.
 * Soft Click empty; lock strategic tip leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 66 kings — tutorial place limit movement exact', () => {
  it('place step Click empty + limit movement options tip', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'place-quadraphage');
    expect(step?.title).toBe('Place Your Quadraphage');
    expect(step?.message).toContain(
      '<p><strong>Click on any empty cell</strong> to place your Quadraphage.</p>'
    );
    expect(step?.message).toContain(
      "opponent's movement options!"
    );
  });
});
