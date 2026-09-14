/**
 * Wave 63 leftover after #301 — Kings Quadraphage Supplies title + place-one cue. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 63 kings — tutorial supplies title', () => {
  it('supplies title; place one each turn; status-supplies highlight', () => {
    const supplies = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'supplies');
    expect(supplies?.title).toBe('Quadraphage Supplies');
    expect(supplies?.message).toMatch(/place one each turn/);
    expect(supplies?.highlightSelector).toBe('.status-supplies');
  });
});
