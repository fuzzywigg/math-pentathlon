/**
 * Wave 65 leftover after tip/#313 — Kings board Red (Player 2) label. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 65 kings — tutorial board red p2 label', () => {
  it('Red (Player 2) exact', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'board-intro');
    expect(step?.message).toMatch(/Red \(Player 2\)/);
  });
});
