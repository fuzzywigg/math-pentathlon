/**
 * Wave 66 leftover after tip/#316 — Hex-a-Gone strategy 1-shape smarter exact.
 * Soft awkward; lock placing 1 shape smarter li leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';

describe('Wave 66 hexagone — tutorial strategy one smarter exact', () => {
  it('strategy placing 1 shape smarter than 3 li exact', () => {
    const step = hexAGoneTutorial.steps.find((s) => s.id === 'strategy-tip');
    expect(step?.message).toContain(
      '<li>Sometimes placing 1 shape is smarter than 3</li>'
    );
    expect(step?.message).toContain(
      '<li>Big shapes are hard to fit later!</li>'
    );
  });
});
