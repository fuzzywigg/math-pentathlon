/**
 * Wave 56 leftover after #256 — Ramrod hand label Blue/Red counts.
 * Distinct from in-hand rod class wave55. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/ramrod/game-controller';

describe('Wave 56 ramrod — hand labels', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('ramrod-styles')?.remove();
  });

  it('labels Blue/Red hands with rod counts', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    const p1 = root.querySelector('.ramrod-hand-label.player1')?.textContent;
    const p2 = root.querySelector('.ramrod-hand-label.player2')?.textContent;
    expect(p1).toMatch(
      new RegExp(`Blue \\(${ctrl.state.playerRods.player1.length}\\)`)
    );
    expect(p2).toMatch(
      new RegExp(`Red \\(${ctrl.state.playerRods.player2.length}\\)`)
    );
  });
});
