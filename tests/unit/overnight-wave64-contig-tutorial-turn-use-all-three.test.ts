/**
 * Wave 64 leftover after tip/#303 — Contig turn Calculate use-all-three exact.
 * Soft Roll/Place wiring existed; lock Calculate fragment. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 64 contig — tutorial turn use all three', () => {
  it('locks Use all three numbers Calculate fragment', () => {
    const step = contig60Tutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(step?.message).toContain(
      '<strong>Calculate:</strong> Use all three numbers with +, -, ×, ÷ to make a result'
    );
    expect(step?.message).toContain(
      '<strong>Place:</strong> Put your chip on that number on the board'
    );
  });
});
