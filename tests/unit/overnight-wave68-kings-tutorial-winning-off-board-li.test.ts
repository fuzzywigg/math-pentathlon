/**
 * Wave 68 leftover after tip/#336 — Kings winning off-board / King LIs. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 68 kings — tutorial winning off-board LIs', () => {
  it('winning locks off-board + Occupied by your King LIs', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'winning');
    expect(step?.message).toContain('Off the board (edge/corner)');
    expect(step?.message).toContain('Occupied by a Quadraphage');
    expect(step?.message).toContain('Occupied by your King');
  });
});
