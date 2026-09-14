/**
 * Wave 56 leftover after #256 — Ramrod tie banner + status copy.
 * Distinct from winner path. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/ramrod/game-controller';

describe('Wave 56 ramrod — tie banner copy', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('ramrod-styles')?.remove();
  });

  it('renders tie status and Tie handshake banner', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    ctrl.state = {
      ...ctrl.state,
      phase: 'gameOver',
      winner: null,
      scores: { player1: 10, player2: 10 },
    };
    ctrl.update();
    expect(root.querySelector('.ramrod-status')?.textContent).toBe(
      "It's a tie!"
    );
    expect(root.querySelector('.ramrod-winner-banner')?.textContent).toBe(
      "It's a Tie! 🤝"
    );
  });
});
