/**
 * Wave 66 leftover after tip/#316 — Kings complete Finish + How to Play exact.
 * Soft congrats/review; lock Finish CTA + Good luck leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 66 kings — tutorial complete finish howto exact', () => {
  it('complete Finish strong + How to Play + Good luck emoji', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.message).toContain('Click <strong>Finish</strong> to start playing.');
    expect(step?.message).toContain('click "How to Play" to review the rules.');
    expect(step?.message).toContain('Good luck and have fun! 🎉');
  });
});
