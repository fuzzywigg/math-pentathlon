/**
 * Wave 60 leftover after tip/#279 — Juggle complete fill-your-grid copy.
 * Distinct from wave58 titles / #289 strategy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 60 juggle — tutorial fill grid', () => {
  it('complete step says fill your grid', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.message).toContain('fill your grid');
  });
});
