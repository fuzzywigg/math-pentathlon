/**
 * Wave 63 leftover after #301 — Hex-a-Gone Placing Shapes title residual. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';

describe('Wave 63 hexagone — tutorial place-shapes title', () => {
  it('place-shapes title Placing Shapes; empty spaces; bottom', () => {
    const place = hexAGoneTutorial.steps.find((s) => s.id === 'place-shapes');
    expect(place?.title).toBe('Placing Shapes');
    expect(place?.message).toMatch(/Shapes must fit in empty spaces/);
    expect(place?.highlightSelector).toBe('.hex-a-gone-board');
    expect(place?.position).toBe('bottom');
  });
});
