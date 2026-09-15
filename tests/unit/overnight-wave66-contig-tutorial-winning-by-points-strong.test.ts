/**
 * Wave 66 leftover after tip/#316 — Contig winning By-points strong exact.
 * Soft By points / board-full match existed; lock strong + highest-score. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 66 contig — tutorial winning by points strong', () => {
  it('winning locks By points strong + highest score exact', () => {
    const step = contig60Tutorial.steps.find((s) => s.id === 'winning');
    expect(step?.message).toContain('<strong>By points:</strong>');
    expect(step?.message).toContain(
      'When board is full, highest score wins'
    );
  });
});
