/**
 * Wave 67 leftover after tip/#324 — Contig winning title exact.
 * Soft 5-in-a-row / by-points body existed; lock Winning title. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 67 contig — tutorial winning title', () => {
  it('pins Winning title + center position leftover', () => {
    const step = contig60Tutorial.steps.find((s) => s.id === 'winning');
    expect(step?.title).toBe('Winning');
    expect(step?.position).toBe('center');
  });
});
