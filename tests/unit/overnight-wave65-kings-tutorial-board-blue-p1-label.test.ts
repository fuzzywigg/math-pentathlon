/**
 * Wave 65 leftover after tip/#313 — Kings board Blue (Player 1) label. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 65 kings — tutorial board blue p1 label', () => {
  it('Blue (Player 1) exact', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'board-intro');
    expect(step?.message).toMatch(/Blue \(Player 1\)/);
  });
});
