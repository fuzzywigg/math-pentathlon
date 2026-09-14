/**
 * Wave 57 leftover after #263 — Par 55 hand count labels Blue (5) / Red (5). Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/par-55/game-controller';
import { CONFIG } from '../../src/games/par-55/types';

describe('Wave 57 par55 — hand count labels', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('par55-styles')?.remove();
  });

  it('Blue/Red hand labels include CONFIG.HAND_SIZE', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    newGameVsHuman(root);
    expect(root.querySelector('.par55-hand-label.player1')?.textContent).toBe(
      `🔵 Blue (${CONFIG.HAND_SIZE})`
    );
    expect(root.querySelector('.par55-hand-label.player2')?.textContent).toBe(
      `🔴 Red (${CONFIG.HAND_SIZE})`
    );
  });
});
