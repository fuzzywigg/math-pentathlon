/**
 * Overnight HEAVY leftovers after #236 — Contig tutorial scoring highlight leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 53 contig — tutorial scoring', () => {
  it('highlights .contig-board on the scoring step', () => {
    const step = contig60Tutorial.steps.find((s) => s.id === 'scoring');
    expect(step?.highlightSelector).toBe('.contig-board');
    expect(step?.position).toBe('top');
    expect(step?.message).toContain('Maximum 8 points');
  });
});
