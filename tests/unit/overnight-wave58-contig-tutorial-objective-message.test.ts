/**
 * Wave 58 leftover after #275 — Contig tutorial objective message. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 58 contig — tutorial objective message', () => {
  it('pins adjacent-to-other-chips leftover', () => {
    const byId = Object.fromEntries(contig60Tutorial.steps.map((s) => [s.id, s]));
    expect(byId.objective?.message).toMatch(/adjacent to other chips/);
  });
});
