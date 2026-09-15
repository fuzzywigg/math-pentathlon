/**
 * Wave 66 leftover after tip/#316 — Kings objective trap-strong exact.
 * Soft /trap your opponent/ leftover; lock strong HTML. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 66 kings — tutorial objective trap strong exact', () => {
  it('objective strong-traps King + wins sentence exact', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'objective');
    expect(step?.message).toContain(
      '<p>Your goal is to <strong>trap your opponent\'s King</strong> so it cannot move'
    );
    expect(step?.message).toContain(
      '<p>The player who traps the other\'s King wins!</p>'
    );
  });
});
