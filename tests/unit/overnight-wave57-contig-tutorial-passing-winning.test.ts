/**
 * Wave 57 leftover after #267 — Contig passing/winning tutorial copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 57 contig — tutorial passing winning', () => {
  it('pins consecutive passes + 5 in a row + board full', () => {
    const byId = Object.fromEntries(contig60Tutorial.steps.map((s) => [s.id, s]));
    expect(byId['passing']?.message).toMatch(/Three consecutive passes/);
    expect(byId['winning']?.message).toMatch(/5 in a row/);
    expect(byId['winning']?.message).toMatch(/When board is full/);
  });
});
