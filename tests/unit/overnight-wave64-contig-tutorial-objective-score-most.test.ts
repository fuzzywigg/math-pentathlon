/**
 * Wave 64 leftover after tip/#303 — Contig objective score-most exact.
 * Soft adjacency copy existed; lock objective HTML. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 64 contig — tutorial objective score most', () => {
  it('locks Score the most points objective fragment', () => {
    const step = contig60Tutorial.steps.find((s) => s.id === 'objective');
    expect(step?.title).toBe('Objective');
    expect(step?.position).toBe('center');
    expect(step?.message).toContain(
      'Score the most points by placing chips on the board adjacent to other chips!'
    );
  });
});
