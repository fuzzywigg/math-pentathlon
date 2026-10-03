/**
 * Overnight TOKENMAXX HEAVY leftovers after #301 — Kwatro chip-info seat exact.
 * Wave55 matches Even/Odd lists; deepen exact seat-icon labels. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/kwatro-sinko/game-controller';

describe('Wave 63 kwatro — chip-info seat exact', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('kwa-styles')?.remove();
  });

  it('chip-info seat labels include exact Blue/Red icons + lists', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    newGameVsHuman(root);
    expect(root.querySelector('.kwa-player-info.player1')?.textContent).toBe(
      '🔵 Blue (Even): 0, 2, 4, 6, 8'
    );
    expect(root.querySelector('.kwa-player-info.player2')?.textContent).toBe(
      '🔴 Red (Odd): 1, 3, 5, 7, 9'
    );
  });
});
