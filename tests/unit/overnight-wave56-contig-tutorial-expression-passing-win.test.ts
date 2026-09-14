/**
 * Wave 56 leftover after #243 — Contig tutorial residual beyond scoring highlight.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 56 contig — tutorial expression/passing/win', () => {
  it('keeps id/name and residual expression/passing/winning copy', () => {
    expect(contig60Tutorial.id).toBe('contig-60-basics');
    expect(contig60Tutorial.name).toBe('Learn Contig 60');
    const byId = Object.fromEntries(contig60Tutorial.steps.map((s) => [s.id, s]));
    expect(byId['expression-rules']?.message).toMatch(/whole number/);
    expect(byId['passing']?.message).toMatch(/Three consecutive passes/);
    expect(byId['winning']?.message).toMatch(/5 in a row/);
    expect(byId['complete']?.message).toMatch(/Finish/);
  });
});
