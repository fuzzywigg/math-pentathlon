/**
 * Wave 58 leftover after #275 — Contig tutorial turn-sequence requiredAction. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 58 contig — tutorial turn required roll', () => {
  it('pins requiredAction click .contig-roll-btn leftover', () => {
    const byId = Object.fromEntries(contig60Tutorial.steps.map((s) => [s.id, s]));
    expect(byId['turn-sequence']?.requiredAction).toEqual({
      type: 'click',
      selector: '.contig-roll-btn',
    });
  });
});
