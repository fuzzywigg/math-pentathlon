/**
 * Wave 68 leftover after tip/#334 — Kings turn-complete real-game opponent exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 68 kings — tutorial turn-complete real game', () => {
  it('turn-complete locks real-game opponent sentence exact', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'turn-complete');
    expect(step?.message).toContain(
      'In a real game, your opponent would now move their King and place a Quadraphage'
    );
    expect(step?.title).toBe('Turn Complete!');
  });
});
