/**
 * Wave 56 leftover after #256 — Ramrod controller select/place status copy.
 * Distinct from rules selectRod identity. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/ramrod/game-controller';
import { selectRod } from '../../src/games/ramrod/rules';

describe('Wave 56 ramrod — status select place', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('ramrod-styles')?.remove();
  });

  it('shows Select a rod then Place rod after selection', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    expect(root.querySelector('.ramrod-status')?.textContent).toMatch(
      /Select a rod/
    );
    const rodId = ctrl.state.playerRods.player1[0];
    ctrl.state = selectRod(ctrl.state, rodId);
    ctrl.update();
    expect(root.querySelector('.ramrod-status')?.textContent).toMatch(
      /Place rod in a valid box/
    );
  });
});
