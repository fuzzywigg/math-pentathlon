/**
 * Wave 67 leftover after tip/#324 — Contig expression any-two strong exact.
 * Soft /any two operations/ existed; lock <strong> markup + can repeat. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 67 contig — tutorial expr any-two strong', () => {
  it('locks strong any-two-operations exact li', () => {
    const step = contig60Tutorial.steps.find((s) => s.id === 'expression-rules');
    expect(step?.message).toContain(
      'You can use <strong>any two operations</strong> (can repeat)'
    );
    expect(step?.title).toBe('Expression Rules');
  });
});
