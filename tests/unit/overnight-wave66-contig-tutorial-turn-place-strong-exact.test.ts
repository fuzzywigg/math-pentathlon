/**
 * Wave 66 leftover after tip/#316 — Contig turn Place strong exact.
 * Soft Use-all-three / Roll strong existed; lock Place chip li leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 66 contig — tutorial turn place strong', () => {
  it('turn-sequence locks Place strong + position bottom', () => {
    const step = contig60Tutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(step?.message).toContain(
      '<strong>Place:</strong> Put your chip on that number on the board'
    );
    expect(step?.position).toBe('bottom');
    expect(step?.requiredAction?.selector).toBe('.contig-roll-btn');
  });
});
