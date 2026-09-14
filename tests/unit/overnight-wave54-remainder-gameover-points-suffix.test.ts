/**
 * Overnight HEAVY leftover after #241 — final score "N points" suffix. Tests-only.
 * Distinct from wave48 banner Draw/Blue/Red.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { renderGameOver } from '../../src/games/remainder-islands/board-ui';

describe('Wave 54 remainder — gameover points suffix', () => {
  it('final values use points suffix', () => {
    const el = renderGameOver({
      ...createInitialState(),
      phase: 'gameOver',
      winner: 'player1',
      player1Score: 11,
      player2Score: 4,
    });
    expect(el.querySelector('.player1 .remainder-final-value')?.textContent).toBe('11 points');
    expect(el.querySelector('.player2 .remainder-final-value')?.textContent).toBe('4 points');
    expect(el.querySelector('.remainder-final-name')?.textContent).toBe('Blue');
  });
});
