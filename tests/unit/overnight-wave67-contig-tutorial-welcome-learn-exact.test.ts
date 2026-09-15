/**
 * Wave 67 leftover after tip/#316 — Contig welcome learn paragraph exact.
 * Soft Contig 60 strong existed; lock Let\'s learn paragraph leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 67 contig — tutorial welcome learn exact', () => {
  it('welcome locks Let\'s learn how to play Contig 60 paragraph', () => {
    const step = contig60Tutorial.steps.find((s) => s.id === 'welcome');
    expect(step?.message).toContain(
      "Let's learn how to play <strong>Contig 60</strong>!"
    );
    expect(step?.position).toBe('center');
  });
});
