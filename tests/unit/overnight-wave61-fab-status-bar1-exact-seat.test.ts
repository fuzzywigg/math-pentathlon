/**
 * Overnight TOKENMAXX HEAVY leftovers after #285 — Fab bar1 status exact seat.
 * Wave55 uses toMatch; deepen exact seat-icon Blue bar1 leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/fab-a-diffy/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 61 fab — status bar1 exact seat', () => {
  it('opening status is exact Blue bar1 prompt with seat icon', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    newGameVsHuman(container);
    expect(container.querySelector('.fab-status.player1')?.textContent).toBe(
      "🔵 Blue's turn - Select first fraction bar"
    );
  });
});
