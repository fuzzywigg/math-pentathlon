/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Frac Fact objective paragraph exact.
 * Wave55 matched /fraction problems/ only. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fracFactTutorial } from '../../src/games/frac-fact/tutorial';

describe('Wave 57 frac tutorial — objective exact', () => {
  it('Objective title + full score-more-points paragraph leftover', () => {
    const step = fracFactTutorial.steps.find((s) => s.id === 'objective');
    expect(step?.title).toBe('Objective');
    expect(step?.message).toContain(
      '<p>Score more points than your opponent by correctly solving fraction problems!</p>'
    );
  });
});
