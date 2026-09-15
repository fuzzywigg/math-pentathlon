/**
 * Wave 66 leftover after tip/#316 — Contig welcome strong name exact.
 * Soft welcome Contig match existed; lock <strong>Contig 60</strong>. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 66 contig — tutorial welcome strong', () => {
  it('welcome uses exact strong Contig 60 markup', () => {
    const step = contig60Tutorial.steps.find((s) => s.id === 'welcome');
    expect(step?.title).toBe('Welcome to Contig 60!');
    expect(step?.message).toContain('<strong>Contig 60</strong>');
    expect(step?.message).toContain("Let's learn how to play");
  });
});
