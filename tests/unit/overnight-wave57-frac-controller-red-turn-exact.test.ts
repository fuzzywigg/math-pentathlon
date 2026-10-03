/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Frac Fact Red's turn after continue.
 * Wave56 exact-matched Blue's turn only. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame, getCurrentState } from '../../src/games/frac-fact/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 57 frac controller — red turn', () => {
  it("after continue paints Red's turn leftover", () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    initGame(root);
    (root.querySelector('.frac-choice-btn') as HTMLButtonElement).click();
    (root.querySelector('.frac-continue-btn') as HTMLButtonElement).click();
    expect(getCurrentState().currentPlayer).toBe('player2');
    const status = root.querySelector('.frac-status.player2') as HTMLElement;
    expect(status).toBeTruthy();
    expect(status.textContent).toMatch(/Red's turn/);
  });
});
