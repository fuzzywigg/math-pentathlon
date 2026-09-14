/**
 * Wave 59 leftover after #279 — Ramrod place status with seat exact.
 * Distinct from wave56 regex /Place rod in a valid box/. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/ramrod/game-controller';
import { selectRod } from '../../src/games/ramrod/rules';

describe('Wave 59 ramrod — status place exact seat', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('ramrod-styles')?.remove();
  });

  it('after selectRod shows Place rod status with seat icon', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    const rodId = ctrl.state.playerRods.player1[0];
    ctrl.state = selectRod(ctrl.state, rodId);
    ctrl.update();
    expect(root.querySelector('.ramrod-status')?.textContent).toBe(
      '🔵 Blue - Place rod in a valid box'
    );
  });
});
