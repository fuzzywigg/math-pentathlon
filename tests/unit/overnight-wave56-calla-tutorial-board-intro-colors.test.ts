/**
 * Wave 56 leftover after #256 — Calla board-intro Blue/Red hex colors.
 * Distinct from wave50 highlightSelector leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 56 calla — tutorial board-intro colors', () => {
  it('embeds Blue/Red seat colors in board-intro copy', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'board-intro');
    expect(step?.title).toBe('The Game Board');
    expect(step?.message).toMatch(/#2196F3/);
    expect(step?.message).toMatch(/#e53935/);
    expect(step?.message).toMatch(/Blue's pits/);
    expect(step?.message).toMatch(/Red's pits/);
    expect(step?.message).toMatch(/on their right side/);
  });
});
