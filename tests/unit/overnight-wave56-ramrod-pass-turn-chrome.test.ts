/**
 * Wave 56 leftover after #256 — Ramrod Pass Turn button chrome.
 * Distinct from passTurn/hasValidMoves engine tests. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/ramrod/game-controller';

describe('Wave 56 ramrod — pass turn chrome', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('ramrod-styles')?.remove();
  });

  it('shows Pass Turn when hand empty and click flips seat', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    ctrl.state = {
      ...ctrl.state,
      playerRods: { ...ctrl.state.playerRods, player1: [] },
      phase: 'selectingRod',
      selectedRod: null,
    };
    ctrl.update();
    const btn = [...root.querySelectorAll('.ramrod-btn-secondary')].find(
      (b) => b.textContent === 'Pass Turn'
    ) as HTMLButtonElement;
    expect(btn).toBeTruthy();
    btn.click();
    expect(ctrl.state.currentPlayer).toBe('player2');
    expect(ctrl.state.phase).toBe('selectingRod');
  });
});
