/**
 * Wave 66 leftover after tip/#316 — Kings winning Occupied by your King exact.
 * Soft Occupied match; lock ul li leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 66 kings — tutorial winning occupied king exact', () => {
  it('winning lists Occupied by your King + no valid moves strong', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'winning');
    expect(step?.message).toContain('<li>Occupied by your King</li>');
    expect(step?.message).toContain('<strong>no valid moves</strong>');
    expect(step?.message).toContain('<li>Off the board (edge/corner)</li>');
  });
});
