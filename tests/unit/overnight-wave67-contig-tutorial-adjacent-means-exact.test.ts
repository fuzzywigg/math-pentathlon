/**
 * Wave 67 leftover after tip/#316 — Contig scoring Adjacent-means exact.
 * Soft adjacency regex + 1-point strong existed; lock Adjacent means li. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 67 contig — tutorial adjacent means exact', () => {
  it('scoring locks Adjacent means touching exact li', () => {
    const step = contig60Tutorial.steps.find((s) => s.id === 'scoring');
    expect(step?.message).toContain(
      'Adjacent means touching horizontally, vertically, or diagonally'
    );
    expect(step?.title).toBe('Scoring');
    expect(step?.highlightSelector).toBe('.contig-board');
  });
});
