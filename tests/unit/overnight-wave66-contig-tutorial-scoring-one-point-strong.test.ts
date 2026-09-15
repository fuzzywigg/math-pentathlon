/**
 * Wave 66 leftover after tip/#316 — Contig scoring 1-point strong exact.
 * Soft 1 point adjacency match existed; lock <strong>1 point</strong>. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 66 contig — tutorial scoring one point strong', () => {
  it('scoring locks exact 1 point strong + adjacent means li', () => {
    const step = contig60Tutorial.steps.find((s) => s.id === 'scoring');
    expect(step?.message).toContain('<strong>1 point</strong>');
    expect(step?.message).toContain(
      'Adjacent means touching horizontally, vertically, or diagonally'
    );
    expect(step?.position).toBe('top');
  });
});
