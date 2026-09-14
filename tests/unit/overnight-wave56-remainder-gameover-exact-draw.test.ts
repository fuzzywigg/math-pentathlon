/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Remainder gameover exact draw. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { renderGameOver } from '../../src/games/remainder-islands/board-ui';

describe('Wave 56 remainder — gameover exact draw', () => {
  it('null winner banner exact Draw leftover', () => {
    const el = renderGameOver({
      ...createInitialState(),
      phase: 'gameOver',
      winner: null,
      player1Score: 5,
      player2Score: 5,
    });
    expect(el.querySelector('.remainder-winner-banner')?.textContent).toBe("It's a Draw!");
  });
});
