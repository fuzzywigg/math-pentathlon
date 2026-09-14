/**
 * Wave 64 leftover after tip/#303 — Contig turn Roll three dice strong.
 * Soft Roll Dice wiring existed; lock strong Roll fragment. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 64 contig — tutorial turn roll three strong', () => {
  it('locks strong Roll three dice fragment + highlight', () => {
    const step = contig60Tutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(step?.message).toContain('<strong>Roll:</strong> Roll three dice');
    expect(step?.highlightSelector).toBe('.contig-dice-area');
    expect(step?.requiredAction).toEqual({
      type: 'click',
      selector: '.contig-roll-btn',
    });
  });
});
