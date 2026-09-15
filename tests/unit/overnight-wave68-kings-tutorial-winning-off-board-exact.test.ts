/**
 * Wave 68 leftover after tip/#334 — Kings winning off-board edge/corner exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 68 kings — tutorial winning off-board', () => {
  it('winning locks Off the board edge/corner li exact', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'winning');
    expect(step?.message).toContain('Off the board (edge/corner)');
    expect(step?.message).toContain('Occupied by a Quadraphage');
    expect(step?.message).toContain('Occupied by your King');
    expect(step?.title).toBe('How to Win');
  });
});
