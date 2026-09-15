/**
 * Wave 66 leftover after tip/#316 — Contig welcome score-adjacent exact.
 * Objective score-most locked; deepen welcome duplicate fragment. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 66 contig — tutorial welcome score adjacent', () => {
  it('welcome locks Score the most points adjacent fragment exact', () => {
    const step = contig60Tutorial.steps.find((s) => s.id === 'welcome');
    expect(step?.message).toContain(
      'Score the most points by placing chips on the board adjacent to other chips!'
    );
    expect(step?.position).toBe('center');
  });
});
