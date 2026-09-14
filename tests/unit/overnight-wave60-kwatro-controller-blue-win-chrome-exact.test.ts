/**
 * Overnight TOKENMAXX HEAVY leftovers after #289 — Kwatro Blue win status + banner exact.
 * No prior controller win chrome tests. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/kwatro-sinko/game-controller';

describe('Wave 60 kwatro — blue win chrome exact', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('kwa-styles')?.remove();
  });

  it('player1 winner shows Blue wins! status and Blue Wins! banner', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    ctrl.state = {
      ...ctrl.state,
      phase: 'gameOver',
      winner: 'player1',
      winningAlignment: null,
    };
    ctrl.update();
    expect(root.querySelector('.kwa-status')?.textContent).toBe('🔵 Blue wins!');
    expect(root.querySelector('.kwa-winner-banner')?.textContent).toBe(
      'Blue Wins! 🎉'
    );
  });
});
