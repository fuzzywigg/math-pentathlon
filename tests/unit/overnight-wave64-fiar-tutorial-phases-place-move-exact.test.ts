/**
 * Wave 64 leftover after #305 — FIAR phases place/move body exacts.
 * Wave61 locks Placement/Movement strongs; deepen 4 chips + pathways. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 64 fiar — tutorial phases place move exact', () => {
  it('phases lock placing 4 chips and moving along pathways copy', () => {
    const step = fiarTutorial.steps.find((s) => s.id === 'game-phases');
    expect(step?.message).toContain(
      'Take turns placing 4 chips each on any empty node'
    );
    expect(step?.message).toContain(
      'Take turns moving your chips along pathways'
    );
  });
});
