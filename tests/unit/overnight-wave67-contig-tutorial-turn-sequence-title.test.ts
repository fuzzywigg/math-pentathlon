/**
 * Wave 67 leftover after tip/#316 — Contig Turn Sequence title exact.
 * Soft Roll/Calculate/Place strongs existed; lock title + bottom position. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 67 contig — tutorial turn sequence title', () => {
  it('turn-sequence locks Turn Sequence title + bottom position', () => {
    const step = contig60Tutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(step?.title).toBe('Turn Sequence');
    expect(step?.position).toBe('bottom');
    expect(step?.highlightSelector).toBe('.contig-dice-area');
  });
});
