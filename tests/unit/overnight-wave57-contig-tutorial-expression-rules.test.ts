/**
 * Wave 57 leftover after #267 — Contig expression-rules tutorial copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 57 contig — tutorial expression rules', () => {
  it('pins all-three-dice / whole-number division / center', () => {
    const step = contig60Tutorial.steps.find((s) => s.id === 'expression-rules');
    expect(step?.title).toBe('Expression Rules');
    expect(step?.position).toBe('center');
    expect(step?.message).toMatch(/all three dice/);
    expect(step?.message).toMatch(/Division must result in a whole number/);
  });
});
