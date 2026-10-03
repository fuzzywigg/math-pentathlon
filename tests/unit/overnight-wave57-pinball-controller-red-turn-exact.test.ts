/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Pinball Red's turn after continue.
 * Wave56 exact-matched Blue's turn only. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  initGame,
  getCurrentState,
} from '../../src/games/fraction-pinball/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 57 pinball controller — red turn', () => {
  it("after continue paints Red's turn leftover", () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    initGame(root);
    const correct = getCurrentState().currentChallenge!.correctAnswer;
    const btn = Array.from(
      root.querySelectorAll('.pinball-choice-btn')
    ).find((el) => el.textContent === correct) as HTMLButtonElement;
    btn.click();
    (root.querySelector('.pinball-continue-btn') as HTMLButtonElement).click();
    expect(getCurrentState().currentPlayer).toBe('player2');
    const status = root.querySelector('.pinball-status.player2') as HTMLElement;
    expect(status).toBeTruthy();
    expect(status.textContent).toMatch(/Red's turn/);
  });
});
