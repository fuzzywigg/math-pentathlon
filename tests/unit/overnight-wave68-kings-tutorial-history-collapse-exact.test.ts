/**
 * Wave 68 leftover after tip/#334 — Kings history collapse toggle exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 68 kings — tutorial history collapse', () => {
  it('move-history locks panel + collapse toggle exact', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'move-history');
    expect(step?.message).toContain('The move history panel shows all moves made in the game');
    expect(step?.message).toContain(
      'You can collapse it by clicking the toggle if you need more space'
    );
    expect(step?.highlightSelector).toBe('#move-history');
  });
});
