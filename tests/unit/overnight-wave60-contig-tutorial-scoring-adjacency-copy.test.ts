/**
 * Wave 60 leftover after #282 — Contig scoring adjacency copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 60 contig — tutorial scoring adjacency', () => {
  it('pins 1 point and adjacency leftovers', () => {
    const byId = Object.fromEntries(contig60Tutorial.steps.map((s) => [s.id, s]));
    expect(byId.scoring?.message).toMatch(/1 point/);
    expect(byId.scoring?.message).toMatch(/horizontally, vertically, or diagonally/);
  });
});
