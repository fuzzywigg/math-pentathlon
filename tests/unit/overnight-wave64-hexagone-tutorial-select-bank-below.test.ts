/**
 * Wave 64 leftover after tip/#303 — Hex-a-Gone select shape bank below. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';

describe('Wave 64 hexagone — tutorial select bank below', () => {
  it('shape bank below the board; different shapes', () => {
    const select = hexAGoneTutorial.steps.find((s) => s.id === 'select-shapes');
    expect(select?.message).toMatch(/shape bank below the board/);
    expect(select?.message).toMatch(/different/);
    expect(select?.highlightSelector).toBe('.hex-a-gone-bank');
  });
});
