/**
 * Wave 68 leftover after tip/#336 — Hex-a-Gone place must fit empty. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';

describe('Wave 68 hexagone — tutorial place must fit', () => {
  it('place-shapes locks must fit empty spaces', () => {
    const step = hexAGoneTutorial.steps.find((s) => s.id === 'place-shapes');
    expect(step?.message).toContain('Shapes must fit in empty spaces!');
    expect(step?.highlightSelector).toBe('.hex-a-gone-board');
    expect(step?.position).toBe('bottom');
  });
});
