/**
 * Wave 59 leftover after #276 — Kings place-quadraphage step (not intro) copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 59 kings — tutorial place-quad step', () => {
  it('place-quadraphage title; empty cell cue; Strategic tip; .board highlight', () => {
    const place = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'place-quadraphage');
    expect(place?.title).toBe('Place Your Quadraphage');
    expect(place?.message).toMatch(/Click on any empty cell/);
    expect(place?.message).toMatch(/Strategic tip/);
    expect(place?.highlightSelector).toBe('.board');
  });
});
