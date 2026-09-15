/**
 * Wave 68 leftover after tip/#334 — Hex-a-Gone place fit-empty exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';

describe('Wave 68 hexagone — tutorial place fit empty', () => {
  it('place-shapes locks fit empty spaces exact', () => {
    const step = hexAGoneTutorial.steps.find((s) => s.id === 'place-shapes');
    expect(step?.message).toContain('Shapes must fit in empty spaces!');
    expect(step?.message).toContain(
      'After selecting, click on the board to place each shape'
    );
    expect(step?.highlightSelector).toBe('.hex-a-gone-board');
  });
});
