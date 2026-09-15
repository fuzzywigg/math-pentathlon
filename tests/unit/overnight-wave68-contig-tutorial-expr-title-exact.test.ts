/**
 * Wave 68 leftover after tip/#337 — Contig expression-rules title exact.
 * Soft any-two strong existed; lock Expression Rules title leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 68 contig — tutorial expr title', () => {
  it('locks Expression Rules title leftover', () => {
    const step = contig60Tutorial.steps.find((s) => s.id === 'expression-rules');
    expect(step?.title).toBe('Expression Rules');
    expect(step?.position).toBe('center');
  });
});
