/**
 * Wave 55 leftover after #250 — Kings supplies / winning / complete / strategy copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 55 kings — tutorial catalog copy', () => {
  it('locks supplies, winning, strategy, place, complete needles', () => {
    const t = kingsQuadraphagesTutorial;
    expect(t.steps.find((s) => s.id === 'supplies')?.message).toMatch(/30 Quadraphages/);
    const winning = t.steps.find((s) => s.id === 'winning');
    expect(winning?.message).toMatch(/no valid moves/);
    expect(winning?.message).toMatch(/8 squares/);
    expect(t.steps.find((s) => s.id === 'strategy-tips')?.message).toMatch(/corner or edge/);
    expect(t.steps.find((s) => s.id === 'place-quadraphage-intro')?.message).toMatch(
      /stay on the board forever/
    );
    const complete = t.steps.find((s) => s.id === 'complete');
    expect(complete?.message).toMatch(/Finish/);
    expect(complete?.message).toMatch(/How to Play/);
  });
});
