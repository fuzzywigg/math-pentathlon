/**
 * Wave 68 leftover after tip/#334 — Hex-a-Gone select bank-below exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';

describe('Wave 68 hexagone — tutorial select bank below', () => {
  it('select-shapes locks bank below the board exact', () => {
    const step = hexAGoneTutorial.steps.find((s) => s.id === 'select-shapes');
    expect(step?.message).toContain('Look at the shape bank below the board');
    expect(step?.highlightSelector).toBe('.hex-a-gone-bank');
    expect(step?.position).toBe('top');
  });
});
