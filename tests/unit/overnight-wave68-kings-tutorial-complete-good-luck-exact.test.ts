/**
 * Wave 68 leftover after tip/#334 — Kings complete Good luck exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 68 kings — tutorial complete good luck', () => {
  it('complete locks Good luck + How to Play review exact', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.message).toContain('Good luck and have fun!');
    expect(step?.message).toContain('click "How to Play" to review the rules');
    expect(step?.position).toBe('center');
  });
});
