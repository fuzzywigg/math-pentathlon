/**
 * Wave 68 leftover after tip/#334 — Kings turn must-complete-both exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 68 kings — tutorial turn both actions', () => {
  it('turn-structure locks must-complete-both sentence exact', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'turn-structure');
    expect(step?.message).toContain('You must complete both actions every turn!');
    expect(step?.title).toBe('Turn Structure');
    expect(step?.position).toBe('center');
  });
});
