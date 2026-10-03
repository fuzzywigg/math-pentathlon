/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact controller status aria-live.
 * Wave25 tested markStatusLive helpers, not mounted controller chrome. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame } from '../../src/games/frac-fact/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 56 frac controller — status live', () => {
  it('initGame paints polite live status with Blue\'s turn leftover', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    initGame(root);
    const status = root.querySelector('.frac-status.player1') as HTMLElement;
    expect(status).toBeTruthy();
    expect(status.getAttribute('role')).toBe('status');
    expect(status.getAttribute('aria-live')).toBe('polite');
    expect(status.textContent).toMatch(/Blue's turn/);
  });
});
