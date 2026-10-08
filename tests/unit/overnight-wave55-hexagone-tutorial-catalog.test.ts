/**
 * Wave 55 leftover after #250 — Hex-a-Gone tutorial catalog + BLOCK_COLORS. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';
import { BLOCK_COLORS } from '../../src/games/hex-a-gone/types';

describe('Wave 55 hexagone — tutorial catalog', () => {
  it('id/name, shape colors, goal, strategy, complete, positions', () => {
    expect(hexAGoneTutorial.id).toBe('hex-a-gone-basics');
    expect(hexAGoneTutorial.name).toBe('Learn Hex-a-Gone!');
    const shapes = hexAGoneTutorial.steps.find((s) => s.id === 'shapes-intro');
    expect(shapes?.message).toContain(BLOCK_COLORS.hexagon);
    expect(shapes?.message).toMatch(/Yellow Hexagons/);
    expect(shapes?.message).toContain(BLOCK_COLORS.trapezoid);
    expect(shapes?.message).toContain(BLOCK_COLORS.rhombus);
    expect(shapes?.message).toContain(BLOCK_COLORS.triangle);
    expect(shapes?.message).toContain(BLOCK_COLORS.square);
    expect(hexAGoneTutorial.steps.find((s) => s.id === 'goal')?.message).toMatch(
      /last player who can place a shape/
    );
    expect(hexAGoneTutorial.steps.find((s) => s.id === 'strategy-tip')?.message).toMatch(
      /awkward spaces/
    );
    expect(hexAGoneTutorial.steps.find((s) => s.id === 'complete')?.message).toMatch(
      /Finish/
    );
    expect(hexAGoneTutorial.steps.find((s) => s.id === 'complete')?.message).toMatch(
      /last player standing/
    );
    expect(hexAGoneTutorial.steps.find((s) => s.id === 'board-intro')?.position).toBe(
      'right'
    );
    expect(hexAGoneTutorial.steps.find((s) => s.id === 'select-shapes')?.position).toBe(
      'top'
    );
    expect(hexAGoneTutorial.steps.find((s) => s.id === 'place-shapes')?.position).toBe(
      'bottom'
    );
  });
});
