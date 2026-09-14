/**
 * Wave 60 leftover after #282 — Contig complete know-how copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 60 contig — tutorial complete know copy', () => {
  it('pins Now you know leftover', () => {
    const byId = Object.fromEntries(contig60Tutorial.steps.map((s) => [s.id, s]));
    expect(byId.complete?.message).toMatch(/Now you know how to play Contig 60/);
  });
});
