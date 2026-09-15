/**
 * Wave 66 leftover after tip/#316 — Kings turn-complete opponent-would exact.
 * Soft completed-your-turn; lock opponent would now move leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 66 kings — tutorial turn-complete opponent exact', () => {
  it('turn-complete opponent would move King + place Quadraphage', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'turn-complete');
    expect(step?.message).toContain(
      'your opponent would now move their King and place a Quadraphage.'
    );
    expect(step?.position).toBe('center');
  });
});
