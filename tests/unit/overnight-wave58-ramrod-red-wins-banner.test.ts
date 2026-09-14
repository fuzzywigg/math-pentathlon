/**
 * Wave 58 leftover after #262 (retry #273 RED) — Ramrod Red Wins banner + status.
 * Distinct from wave56 Blue Wins. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/ramrod/game-controller';

describe('Wave 58 ramrod — red wins banner', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('ramrod-styles')?.remove();
  });

  it('renders Red Wins banner and wins-with status for player2', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    ctrl.state = {
      ...ctrl.state,
      phase: 'gameOver',
      winner: 'player2',
      scores: { player1: 8, player2: 24 },
    };
    ctrl.update();
    expect(root.querySelector('.ramrod-status')?.textContent).toMatch(
      /wins with 24cm!/
    );
    expect(root.querySelector('.ramrod-winner-banner')?.textContent).toBe(
      'Red Wins! 🎉'
    );
  });
});
