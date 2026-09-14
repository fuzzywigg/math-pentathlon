/**
 * Wave 59 leftover after #276 — Kings move-king title + below cue + selector. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 59 kings — tutorial move-king below cue', () => {
  it('move-king title; directly below; row2 col5 highlight', () => {
    const move = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'move-king');
    expect(move?.title).toBe('Move Your King');
    expect(move?.message).toMatch(/directly below your King/);
    expect(move?.highlightSelector).toBe('.cell[data-row="2"][data-col="5"]');
  });
});
