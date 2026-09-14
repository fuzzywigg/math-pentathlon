/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Contig tutorial passing/winning. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 56 contig — tutorial passing winning', () => {
  it('passing three consecutive + winning 5-in-a-line leftover', () => {
    const passing = contig60Tutorial.steps.find((s) => s.id === 'passing');
    expect(passing?.message).toMatch(/Three consecutive passes/);
    const winning = contig60Tutorial.steps.find((s) => s.id === 'winning');
    expect(winning?.message).toMatch(/5 chips in a line/);
    expect(winning?.message).toMatch(/board is full/);
  });
});
