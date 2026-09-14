/**
 * Wave 64 leftover after tip/#303 — Contig winning 5-chips-in-line exact.
 * Soft By points existed; lock five-in-a-row HTML. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 64 contig — tutorial winning five chips', () => {
  it('locks 5 chips in a line winning fragment', () => {
    const step = contig60Tutorial.steps.find((s) => s.id === 'winning');
    expect(step?.message).toContain(
      '<strong>5 in a row:</strong> First to get 5 chips in a line wins!'
    );
    expect(step?.position).toBe('center');
  });
});
