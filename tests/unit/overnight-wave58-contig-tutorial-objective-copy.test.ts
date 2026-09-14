/**
 * Wave 58 Contig/SD residual — Contig tutorial objective copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 58 contig — tutorial objective', () => {
  it('pins objective title, adjacent copy, center position', () => {
    const step = contig60Tutorial.steps.find((s) => s.id === 'objective');
    expect(step?.title).toBe('Objective');
    expect(step?.message).toMatch(/adjacent to other chips/);
    expect(step?.position).toBe('center');
  });
});
