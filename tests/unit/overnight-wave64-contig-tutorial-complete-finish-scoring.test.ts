/**
 * Wave 64 leftover after tip/#303 — Contig complete Finish scoring exact.
 * Soft /Finish/ /start scoring/ existed; lock strong HTML. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 64 contig — tutorial complete finish scoring', () => {
  it('locks Finish strong + start scoring fragment', () => {
    const step = contig60Tutorial.steps.find((s) => s.id === 'complete');
    expect(step?.message).toContain(
      'Click <strong>Finish</strong> and start scoring!'
    );
    expect(step?.position).toBe('center');
  });
});
