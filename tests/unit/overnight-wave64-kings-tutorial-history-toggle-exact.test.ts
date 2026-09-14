/**
 * Wave 64 leftover after tip/#303 — Kings move-history toggle exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 64 kings — tutorial history toggle exact', () => {
  it('collapse it by clicking the toggle; Move History title', () => {
    const history = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'move-history');
    expect(history?.title).toBe('Move History');
    expect(history?.message).toMatch(/collapse it by clicking the toggle/);
    expect(history?.highlightSelector).toBe('#move-history');
  });
});
