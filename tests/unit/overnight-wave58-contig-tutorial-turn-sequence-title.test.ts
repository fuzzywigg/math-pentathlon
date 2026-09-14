/**
 * Wave 58 leftover after #275 — Contig tutorial turn-sequence title. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 58 contig — tutorial turn-sequence title', () => {
  it('pins Turn Sequence title leftover', () => {
    const byId = Object.fromEntries(contig60Tutorial.steps.map((s) => [s.id, s]));
    expect(byId['turn-sequence']?.title).toBe('Turn Sequence');
  });
});
