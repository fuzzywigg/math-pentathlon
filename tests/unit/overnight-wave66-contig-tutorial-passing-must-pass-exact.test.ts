/**
 * Wave 66 leftover after tip/#316 — Contig passing must-pass exact li.
 * Soft cannot-make match existed; lock full must-pass sentence. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 66 contig — tutorial passing must pass', () => {
  it('passing locks cannot-make must-pass exact li', () => {
    const step = contig60Tutorial.steps.find((s) => s.id === 'passing');
    expect(step?.message).toContain(
      'If you cannot make any available number, you must pass'
    );
    expect(step?.title).toBe('Passing');
  });
});
