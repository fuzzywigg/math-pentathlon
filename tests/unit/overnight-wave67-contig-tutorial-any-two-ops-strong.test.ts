/**
 * Wave 67 leftover after tip/#316 — Contig any-two-ops strong exact.
 * Soft /any two operations/ + (can repeat) existed; lock strong markup. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 67 contig — tutorial any two ops strong', () => {
  it('expression-rules locks any two operations strong exact', () => {
    const step = contig60Tutorial.steps.find((s) => s.id === 'expression-rules');
    expect(step?.message).toContain(
      'You can use <strong>any two operations</strong> (can repeat)'
    );
    expect(step?.title).toBe('Expression Rules');
  });
});
