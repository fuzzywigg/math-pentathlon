/**
 * Wave 64 leftover after tip/#303 — Contig passing three-elim exact.
 * Soft cannot-make existed; lock three consecutive eliminates. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 64 contig — tutorial passing three elim', () => {
  it('locks Three consecutive passes eliminates fragment', () => {
    const step = contig60Tutorial.steps.find((s) => s.id === 'passing');
    expect(step?.message).toContain(
      'Three consecutive passes eliminates you from the game'
    );
    expect(step?.position).toBe('center');
  });
});
