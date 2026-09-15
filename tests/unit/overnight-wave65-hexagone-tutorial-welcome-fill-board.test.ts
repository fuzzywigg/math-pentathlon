/**
 * Wave 65 leftover after tip/#313 — Hex-a-Gone welcome fill up the board. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';

describe('Wave 65 hexagone — tutorial welcome fill board', () => {
  it('fill up the board', () => {
    const step = hexAGoneTutorial.steps.find((s) => s.id === 'welcome');
    expect(step?.message).toMatch(/fill up the board/);
  });
});
