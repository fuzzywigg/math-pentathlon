/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Contig tutorial complete. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 56 contig — tutorial complete', () => {
  it('complete Ready to Play start scoring leftover', () => {
    const step = contig60Tutorial.steps.find((s) => s.id === 'complete');
    expect(step?.title).toBe('Ready to Play!');
    expect(step?.message).toMatch(/start scoring/);
  });
});
