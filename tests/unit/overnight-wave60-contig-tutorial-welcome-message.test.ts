/**
 * Wave 60 leftover after #282 — Contig welcome message body. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 60 contig — tutorial welcome message', () => {
  it('pins learn-how-to-play body leftover', () => {
    const byId = Object.fromEntries(contig60Tutorial.steps.map((s) => [s.id, s]));
    expect(byId.welcome?.message).toMatch(/Let's learn how to play/);
    expect(byId.welcome?.message).toMatch(/Contig 60/);
  });
});
