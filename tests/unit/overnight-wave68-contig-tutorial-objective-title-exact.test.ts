/**
 * Wave 68 leftover after tip/#337 — Contig objective title exact.
 * Soft score-most copy existed; lock Objective title leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 68 contig — tutorial objective title', () => {
  it('locks Objective title + center position leftover', () => {
    const step = contig60Tutorial.steps.find((s) => s.id === 'objective');
    expect(step?.title).toBe('Objective');
    expect(step?.position).toBe('center');
  });
});
