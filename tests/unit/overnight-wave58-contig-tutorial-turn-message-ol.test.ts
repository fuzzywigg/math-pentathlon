/**
 * Wave 58 leftover after #275 — Contig tutorial turn-sequence message ol. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 58 contig — tutorial turn message', () => {
  it('pins Roll/Calculate/Place leftover', () => {
    const byId = Object.fromEntries(contig60Tutorial.steps.map((s) => [s.id, s]));
    const msg = byId['turn-sequence']?.message ?? '';
    expect(msg).toMatch(/<ol>/);
    expect(msg).toMatch(/Roll three dice/);
    expect(msg).toMatch(/Put your chip on that number/);
  });
});
