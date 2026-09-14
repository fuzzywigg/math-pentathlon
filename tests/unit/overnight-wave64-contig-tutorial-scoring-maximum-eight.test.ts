/**
 * Wave 64 leftover after tip/#303 — Contig scoring Maximum 8 exact.
 * Soft 1 point / adjacency existed; lock Maximum 8 leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 64 contig — tutorial scoring maximum eight', () => {
  it('locks Maximum 8 points per placement fragment', () => {
    const step = contig60Tutorial.steps.find((s) => s.id === 'scoring');
    expect(step?.message).toContain(
      'Maximum 8 points per placement (surrounded on all sides)'
    );
    expect(step?.highlightSelector).toBe('.contig-board');
  });
});
