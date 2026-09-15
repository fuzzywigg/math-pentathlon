/**
 * Wave 67 leftover after tip/#316 — Contig complete Ready title exact.
 * Soft know/Finish scoring existed; lock Ready to Play! title leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 67 contig — tutorial complete ready title', () => {
  it('complete locks Ready to Play! title leftover', () => {
    const step = contig60Tutorial.steps.find((s) => s.id === 'complete');
    expect(step?.title).toBe('Ready to Play!');
    expect(step?.position).toBe('center');
    expect(step?.message).toContain('Now you know how to play Contig 60!');
  });
});
