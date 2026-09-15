/**
 * Wave 67 leftover after tip/#316 — Contig winning 5-in-a-row strong exact.
 * Soft five-chips / By-points existed; re-pin 5 in a row strong + title. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 67 contig — tutorial five in row strong', () => {
  it('winning locks 5 in a row strong exact + Winning title', () => {
    const step = contig60Tutorial.steps.find((s) => s.id === 'winning');
    expect(step?.message).toContain(
      '<strong>5 in a row:</strong> First to get 5 chips in a line wins!'
    );
    expect(step?.title).toBe('Winning');
    expect(step?.position).toBe('center');
  });
});
