/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball controller status aria-live.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  initGame,
  newGameVsHuman,
} from '../../src/games/fraction-pinball/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 56 pinball controller — status live', () => {
  it('initGame + newGameVsHuman paint polite live status leftover', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    initGame(root);
    let status = root.querySelector('.pinball-status.player1') as HTMLElement;
    expect(status.getAttribute('role')).toBe('status');
    expect(status.getAttribute('aria-live')).toBe('polite');
    expect(status.textContent).toMatch(/Blue's turn/);
    newGameVsHuman();
    status = root.querySelector('.pinball-status.player1') as HTMLElement;
    expect(status.getAttribute('aria-live')).toBe('polite');
    expect(root.querySelector('.pinball-challenge')).toBeTruthy();
    expect(root.querySelector('.pinball-board')).toBeTruthy();
  });
});
