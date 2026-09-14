/**
 * Wave 57 leftover after #267 — Contig welcome/complete tutorial copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 57 contig — tutorial welcome complete', () => {
  it('pins welcome title and Finish scoring copy', () => {
    const byId = Object.fromEntries(contig60Tutorial.steps.map((s) => [s.id, s]));
    expect(byId['welcome']?.title).toBe('Welcome to Contig 60!');
    expect(byId['complete']?.title).toBe('Ready to Play!');
    expect(byId['complete']?.message).toMatch(/Finish/);
    expect(byId['complete']?.message).toMatch(/start scoring/);
  });
});
