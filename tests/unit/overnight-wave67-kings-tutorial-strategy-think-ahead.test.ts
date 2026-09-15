/**
 * Wave 67 leftover after tip/#324 — Kings strategy think-ahead 2-3 moves. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 67 kings — tutorial strategy think ahead', () => {
  it('strategy-tips pins Think ahead 2-3 moves exact', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(step?.message).toContain(
      'Think ahead - where will both Kings be in 2-3 moves?'
    );
    expect(step?.title).toBe('Strategy Tips');
  });
});
