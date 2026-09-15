/**
 * Wave 68 leftover after tip/#337 — Contig complete title exact.
 * Soft know-how / Finish strong existed; lock Ready to Play title leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 68 contig — tutorial complete title', () => {
  it('locks Ready to Play title leftover', () => {
    const step = contig60Tutorial.steps.find((s) => s.id === 'complete');
    expect(step?.title).toBe('Ready to Play!');
    expect(step?.position).toBe('center');
  });
});
