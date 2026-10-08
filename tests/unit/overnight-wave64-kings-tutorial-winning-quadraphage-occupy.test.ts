/**
 * Wave 64 leftover after tip/#303 — Kings winning Occupied by a Quadraphage. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 64 kings — tutorial winning quadraphage occupy', () => {
  it('Occupied by a Quadraphage + no valid moves', () => {
    const winning = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'winning');
    expect(winning?.message).toMatch(/Occupied by a Quadraphage/);
    expect(winning?.message).toMatch(/no valid moves/);
    expect(winning?.title).toBe('How to Win');
  });
});
