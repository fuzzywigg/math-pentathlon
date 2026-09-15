/**
 * Wave 66 leftover after tip/#316 — Sum turn Roll Dice strong exact.
 * Soft Select/Match copy existed; lock Roll Dice strong + 2-12. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 66 sum — tutorial turn roll dice strong', () => {
  it('turn-sequence locks Roll Dice strong + target sum 2-12', () => {
    const step = sumDominoesTutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(step?.message).toContain(
      '<strong>Roll Dice:</strong> Roll two dice to get a target sum (2-12)'
    );
    expect(step?.highlightSelector).toBe('.sd-dice-area');
    expect(step?.requiredAction?.selector).toBe('.sd-roll-btn');
  });
});
