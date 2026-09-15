/**
 * Wave 68 leftover after tip/#336 — Hex-a-Gone board hexagon spaces. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';

describe('Wave 68 hexagone — tutorial board hexagon spaces', () => {
  it('board-intro locks hexagon spaces + take turns filling', () => {
    const step = hexAGoneTutorial.steps.find((s) => s.id === 'board-intro');
    expect(step?.message).toContain('hexagon spaces');
    expect(step?.message).toContain('take turns filling it with shapes');
    expect(step?.highlightSelector).toBe('.hex-a-gone-board');
  });
});
