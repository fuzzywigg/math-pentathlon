/**
 * Wave 67 leftover after tip/#324 — Contig passing title exact.
 * Soft must-pass / three-elim body existed; lock Passing title. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 67 contig — tutorial passing title', () => {
  it('pins Passing title + center leftover', () => {
    const step = contig60Tutorial.steps.find((s) => s.id === 'passing');
    expect(step?.title).toBe('Passing');
    expect(step?.position).toBe('center');
  });
});
