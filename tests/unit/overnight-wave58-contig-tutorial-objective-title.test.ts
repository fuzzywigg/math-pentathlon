/**
 * Wave 58 leftover after #275 — Contig tutorial objective title. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 58 contig — tutorial objective title', () => {
  it('pins Objective title leftover', () => {
    const byId = Object.fromEntries(contig60Tutorial.steps.map((s) => [s.id, s]));
    expect(byId.objective?.title).toBe('Objective');
  });
});
