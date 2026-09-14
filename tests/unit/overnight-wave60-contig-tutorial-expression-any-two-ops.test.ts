/**
 * Wave 60 leftover after #282 — Contig expression any-two-ops copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 60 contig — tutorial expression any two ops', () => {
  it('pins any two operations leftover', () => {
    const byId = Object.fromEntries(contig60Tutorial.steps.map((s) => [s.id, s]));
    expect(byId['expression-rules']?.message).toMatch(/any two operations/);
  });
});
