/**
 * Wave 66 leftover after tip/#316 — Contig complete know-how exact p.
 * Soft Now-you-know regex existed; lock exact Contig 60 paragraph. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 66 contig — tutorial complete know exact', () => {
  it('complete locks Now you know Contig 60 exact paragraph', () => {
    const step = contig60Tutorial.steps.find((s) => s.id === 'complete');
    expect(step?.message).toContain('Now you know how to play Contig 60!');
    expect(step?.title).toBe('Ready to Play!');
  });
});
