/**
 * Wave 56 leftover after #256 — Hex tutorial players + board-intro + welcome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';

describe('Wave 56 hex — tutorial players/board', () => {
  it('welcome/players/board-intro copy needles', () => {
    expect(hexTutorial.steps.find((s) => s.id === 'welcome')?.title).toBe(
      'Welcome to Hex!'
    );
    expect(hexTutorial.steps.find((s) => s.id === 'welcome')?.message).toMatch(
      /unbroken chain/
    );
    const players = hexTutorial.steps.find((s) => s.id === 'players');
    expect(players?.message).toMatch(/top to bottom/);
    expect(players?.message).toMatch(/left to right/);
    expect(players?.highlightSelector).toBe('.hex-legend');
    const intro = hexTutorial.steps.find((s) => s.id === 'board-intro');
    expect(intro?.highlightSelector).toBe('.hex-board');
    expect(intro?.position).toBe('right');
  });
});
