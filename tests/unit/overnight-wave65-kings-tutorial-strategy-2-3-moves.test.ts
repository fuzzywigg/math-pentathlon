/**
 * Wave 65 leftover after tip/#313 — Kings strategy 2-3 moves tip. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 65 kings — tutorial strategy 2-3 moves', () => {
  it('where will both Kings be in 2-3 moves', () => {
    const tips = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(tips?.message).toMatch(/where will both Kings be in 2-3 moves/);
  });
});
