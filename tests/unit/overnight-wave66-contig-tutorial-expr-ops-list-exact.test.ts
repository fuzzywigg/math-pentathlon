/**
 * Wave 66 leftover after tip/#316 — Contig expression ops catalog exact.
 * Soft any-two-ops / division existed; lock Operations list leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 66 contig — tutorial expr ops list', () => {
  it('expression-rules locks Operations +/−/×/÷ catalog exact', () => {
    const step = contig60Tutorial.steps.find((s) => s.id === 'expression-rules');
    expect(step?.message).toContain(
      'Operations: + (add), - (subtract), × (multiply), ÷ (divide)'
    );
    expect(step?.message).toContain('Division must result in a whole number');
  });
});
