/**
 * Wave 59 Contig/SD residual — Contig scoring tutorial highlight. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 59 contig — scoring highlight', () => {
  it('scoring step highlights .contig-board with top position', () => {
    const step = contig60Tutorial.steps.find((s) => s.id === 'scoring');
    expect(step?.highlightSelector).toBe('.contig-board');
    expect(step?.position).toBe('top');
    expect(step?.message).toMatch(/1 point/);
  });
});
