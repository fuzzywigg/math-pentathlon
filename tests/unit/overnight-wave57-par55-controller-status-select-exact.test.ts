/**
 * Wave 57 leftover after #263 — Par 55 opening select-block status exact. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/par-55/game-controller';

describe('Wave 57 par55 — select status', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('par55-styles')?.remove();
  });

  it("opening shows Blue's turn - Select a block", () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    newGameVsHuman(root);
    const status = root.querySelector('.par55-status');
    expect(status?.classList.contains('player1')).toBe(true);
    expect(status?.textContent).toBe("🔵 Blue's turn - Select a block");
  });
});
