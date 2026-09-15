/**
 * Overnight TOKENMAXX HEAVY leftovers after #324 — Kwatro status player2 class.
 * Wave63 locks Red select status text; deepen .player2 class after pass. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/kwatro-sinko/game-controller';
import { passTurn } from '../../src/games/kwatro-sinko/rules';

describe('Wave 67 kwatro — controller status player2 class', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('kwa-styles')?.remove();
  });

  it('after pass status has player2 class', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    ctrl.state = passTurn(ctrl.state);
    ctrl.update();
    const status = root.querySelector('.kwa-status');
    expect(status?.classList.contains('player2')).toBe(true);
  });
});
