/**
 * Wave 60 leftover after #282 — Contig passing cannot-make copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 60 contig — tutorial passing cannot make', () => {
  it('pins cannot-make available number leftover', () => {
    const byId = Object.fromEntries(contig60Tutorial.steps.map((s) => [s.id, s]));
    expect(byId.passing?.message).toMatch(/cannot make any available number/);
  });
});
