/**
 * Overnight TOKENMAXX HEAVY leftovers after #306/#316 — Kwatro status player1 class.
 * Wave57 locks Blue select status text; deepen .player1 class on opening. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/kwatro-sinko/game-controller';

describe('Wave 66 kwatro — controller status player1 class', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('kwa-styles')?.remove();
  });

  it('opening status has kwa-status player1 classes', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    newGameVsHuman(root);
    const status = root.querySelector('.kwa-status');
    expect(status?.classList.contains('kwa-status')).toBe(true);
    expect(status?.classList.contains('player1')).toBe(true);
  });
});
