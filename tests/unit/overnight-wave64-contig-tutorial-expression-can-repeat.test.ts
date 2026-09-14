/**
 * Wave 64 leftover after tip/#303 — Contig expression can-repeat exact.
 * Soft any-two-ops existed; lock can repeat leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 64 contig — tutorial expression can repeat', () => {
  it('locks can repeat + all three dice strong fragments', () => {
    const step = contig60Tutorial.steps.find((s) => s.id === 'expression-rules');
    expect(step?.message).toContain('(can repeat)');
    expect(step?.message).toContain(
      'You must use <strong>all three dice</strong>'
    );
    expect(step?.position).toBe('center');
  });
});
