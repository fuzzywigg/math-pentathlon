/**
 * Wave 63 leftover after #301 — Hex-a-Gone Selecting Shapes title residual. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';

describe('Wave 63 hexagone — tutorial select-shapes title', () => {
  it('select-shapes title Selecting Shapes; bank highlight; top', () => {
    const select = hexAGoneTutorial.steps.find((s) => s.id === 'select-shapes');
    expect(select?.title).toBe('Selecting Shapes');
    expect(select?.highlightSelector).toBe('.hex-a-gone-bank');
    expect(select?.position).toBe('top');
    expect(select?.message).toMatch(/1, 2, or 3/);
  });
});
