/**
 * Wave 56 leftover after #256 — Ramrod winner banner + status copy.
 * Distinct from inject CSS class-name only. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/ramrod/game-controller';

describe('Wave 56 ramrod — winner banner copy', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('ramrod-styles')?.remove();
  });

  it('renders wins-with status and Blue Wins banner', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    ctrl.state = {
      ...ctrl.state,
      phase: 'gameOver',
      winner: 'player1',
      scores: { player1: 24, player2: 5 },
    };
    ctrl.update();
    expect(root.querySelector('.ramrod-status')?.textContent).toMatch(
      /wins with 24cm!/
    );
    expect(root.querySelector('.ramrod-winner-banner')?.textContent).toBe(
      'Blue Wins! 🎉'
    );
  });
});
