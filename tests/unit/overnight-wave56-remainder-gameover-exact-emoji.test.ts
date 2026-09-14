/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Remainder gameover exact emoji. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { renderGameOver } from '../../src/games/remainder-islands/board-ui';

describe('Wave 56 remainder — gameover exact emoji', () => {
  it('Blue/Red Wins exact with party emoji leftover', () => {
    const p1 = renderGameOver({
      ...createInitialState(),
      phase: 'gameOver',
      winner: 'player1',
    });
    expect(p1.querySelector('.remainder-winner-banner')?.textContent).toBe('Blue Wins! 🎉');
    const p2 = renderGameOver({
      ...createInitialState(),
      phase: 'gameOver',
      winner: 'player2',
    });
    expect(p2.querySelector('.remainder-winner-banner')?.textContent).toBe('Red Wins! 🎉');
  });
});
