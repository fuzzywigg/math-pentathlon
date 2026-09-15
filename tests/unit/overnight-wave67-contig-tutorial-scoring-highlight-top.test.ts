/**
 * Wave 67 leftover after tip/#324 — Contig scoring highlight top exact.
 * Soft .contig-board highlight existed; lock position top with title. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 67 contig — tutorial scoring highlight top', () => {
  it('pins Scoring title + .contig-board top leftover', () => {
    const step = contig60Tutorial.steps.find((s) => s.id === 'scoring');
    expect(step?.title).toBe('Scoring');
    expect(step?.highlightSelector).toBe('.contig-board');
    expect(step?.position).toBe('top');
  });
});
