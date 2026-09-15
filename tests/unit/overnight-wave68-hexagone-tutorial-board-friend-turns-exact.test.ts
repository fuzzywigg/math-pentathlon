/**
 * Wave 68 leftover after tip/#334 — Hex-a-Gone board friend-turns exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';

describe('Wave 68 hexagone — tutorial board friend turns', () => {
  it('board-intro locks friend turns filling shapes exact', () => {
    const step = hexAGoneTutorial.steps.find((s) => s.id === 'board-intro');
    expect(step?.message).toContain(
      'You and your friend take turns filling it with shapes!'
    );
    expect(step?.message).toContain('hexagon spaces');
    expect(step?.highlightSelector).toBe('.hex-a-gone-board');
  });
});
