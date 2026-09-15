/**
 * Wave 66 leftover after tip/#316 — Kings turn-structure two-parts exact.
 * Soft title/complete; lock Move/Place li leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 66 kings — tutorial turn-structure two parts exact', () => {
  it('two parts ol Move King + Place Quadraphage exact', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'turn-structure');
    expect(step?.message).toContain('<strong>two parts</strong>');
    expect(step?.message).toContain(
      '<li><strong>Move your King</strong> - one square in any direction</li>'
    );
    expect(step?.message).toContain(
      '<li><strong>Place a Quadraphage</strong> - a blocker on any empty square</li>'
    );
  });
});
