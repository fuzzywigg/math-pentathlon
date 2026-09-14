/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Contig tutorial expression-rules. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 56 contig — tutorial expression rules', () => {
  it('expression-rules require all dice and whole-number division leftover', () => {
    const step = contig60Tutorial.steps.find((s) => s.id === 'expression-rules');
    expect(step?.message).toMatch(/all three dice/);
    expect(step?.message).toMatch(/any two operations/);
    expect(step?.message).toMatch(/whole number/);
  });
});
