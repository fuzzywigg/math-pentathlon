/**
 * Wave 59 leftover after #276 — Kings your/opponent king start-copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 59 kings — tutorial king start copy', () => {
  it('your-king top center; opponent-king title + bottom center', () => {
    const yours = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'your-king');
    expect(yours?.message).toMatch(/Your King begins at the top center/);
    const opp = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'opponent-king');
    expect(opp?.title).toBe("Opponent's King");
    expect(opp?.message).toMatch(/bottom center/);
  });
});
