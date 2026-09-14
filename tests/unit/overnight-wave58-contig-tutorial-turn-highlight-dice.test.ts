/**
 * Wave 58 leftover after #275 — Contig tutorial turn-sequence highlight. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 58 contig — tutorial turn highlight dice', () => {
  it('pins highlightSelector .contig-dice-area leftover', () => {
    const byId = Object.fromEntries(contig60Tutorial.steps.map((s) => [s.id, s]));
    expect(byId['turn-sequence']?.highlightSelector).toBe('.contig-dice-area');
  });
});
