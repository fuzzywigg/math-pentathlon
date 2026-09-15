/**
 * Wave 68 leftover after tip/#337 — Contig scoring title exact.
 * Soft highlight top existed; lock Scoring title leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 68 contig — tutorial scoring title', () => {
  it('locks Scoring title leftover', () => {
    const step = contig60Tutorial.steps.find((s) => s.id === 'scoring');
    expect(step?.title).toBe('Scoring');
  });
});
