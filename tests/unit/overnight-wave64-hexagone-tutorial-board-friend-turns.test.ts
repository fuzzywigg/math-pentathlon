/**
 * Wave 64 leftover after tip/#303 — Hex-a-Gone board friend take turns. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';

describe('Wave 64 hexagone — tutorial board friend turns', () => {
  it('You and your friend take turns; hexagon spaces', () => {
    const intro = hexAGoneTutorial.steps.find((s) => s.id === 'board-intro');
    expect(intro?.message).toMatch(/You and your friend take turns filling it with shapes/);
    expect(intro?.message).toMatch(/hexagon spaces/);
    expect(intro?.highlightSelector).toBe('.hex-a-gone-board');
  });
});
