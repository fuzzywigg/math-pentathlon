/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Contig tutorial identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 56 contig — tutorial identity', () => {
  it('catalog id/name leftover', () => {
    expect(contig60Tutorial.id).toBe('contig-60-basics');
    expect(contig60Tutorial.name).toBe('Learn Contig 60');
  });
});
