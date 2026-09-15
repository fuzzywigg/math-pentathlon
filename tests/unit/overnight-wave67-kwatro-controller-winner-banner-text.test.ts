/**
 * Wave 67 leftover after tip/#324 — Kwatro winner banner text exact.
 * Wave60 locks win status; deepen banner Wins! copy leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/kwatro-sinko/game-controller';

describe('Wave 67 kwatro — controller winner banner text', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('kwa-styles')?.remove();
  });

  it('Blue win mounts winner-banner with Wins! text', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    ctrl.state = { ...ctrl.state, winner: 'player1', phase: 'gameOver' };
    ctrl.update();
    expect(root.querySelector('.kwa-winner-banner')?.textContent).toBe(
      'Blue Wins! 🎉'
    );
  });
});
