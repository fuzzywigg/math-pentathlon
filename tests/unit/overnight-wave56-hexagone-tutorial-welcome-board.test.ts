/**
 * Wave 56 leftover after #256 — Hex-a-Gone welcome + board-intro leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';

describe('Wave 56 hexagone — tutorial welcome/board', () => {
  it('welcome title; board-intro highlights .hex-a-gone-board', () => {
    const welcome = hexAGoneTutorial.steps.find((s) => s.id === 'welcome');
    expect(welcome?.title).toBe('Welcome to Hex-a-Gone!');
    expect(welcome?.message).toMatch(/shape-fitting puzzle/);
    const board = hexAGoneTutorial.steps.find((s) => s.id === 'board-intro');
    expect(board?.highlightSelector).toBe('.hex-a-gone-board');
    expect(board?.message).toMatch(/hexagon spaces/);
  });
});
