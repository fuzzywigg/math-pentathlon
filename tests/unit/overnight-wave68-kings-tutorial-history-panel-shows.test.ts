/**
 * Wave 68 leftover after tip/#336 — Kings history panel shows exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 68 kings — tutorial history panel shows', () => {
  it('move-history locks panel shows + collapse toggle', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'move-history');
    expect(step?.message).toContain('move history panel shows all moves');
    expect(step?.message).toContain('collapse it by clicking the toggle');
    expect(step?.highlightSelector).toBe('#move-history');
  });
});
