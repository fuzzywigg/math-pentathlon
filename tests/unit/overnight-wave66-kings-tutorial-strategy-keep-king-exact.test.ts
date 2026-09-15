/**
 * Wave 66 leftover after tip/#316 — Kings strategy Keep your own King exact.
 * Soft Think ahead / cut off; lock Keep King li leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 66 kings — tutorial strategy keep king exact', () => {
  it('strategy Keep your own King away from edges li exact', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(step?.message).toContain(
      '<li>Keep your own King away from edges</li>'
    );
    expect(step?.message).toContain(
      '<li>Think ahead - where will both Kings be in 2-3 moves?</li>'
    );
  });
});
