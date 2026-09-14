/**
 * Wave 60 leftover after #282 — Contig winning by-points copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 60 contig — tutorial winning by points', () => {
  it('pins By points leftover', () => {
    const byId = Object.fromEntries(contig60Tutorial.steps.map((s) => [s.id, s]));
    expect(byId.winning?.message).toMatch(/By points/);
    expect(byId.winning?.message).toMatch(/board is full/);
  });
});
