/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — frac × pinball Red's turn handshake.
 * Wave56 Blue-only status live; Red seat after continue unasserted. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  initGame as initFrac,
  getCurrentState as fracState,
} from '../../src/games/frac-fact/game-controller';
import {
  initGame as initPin,
  getCurrentState as pinState,
} from '../../src/games/fraction-pinball/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('frac-fact-styles')?.remove();
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 57 handshake — red turn', () => {
  it('both engines paint Red\'s turn after first continue leftover', () => {
    const fracRoot = document.createElement('div');
    const pinRoot = document.createElement('div');
    document.body.append(fracRoot, pinRoot);
    initFrac(fracRoot);
    initPin(pinRoot);

    (fracRoot.querySelector('.frac-choice-btn') as HTMLButtonElement).click();
    (fracRoot.querySelector('.frac-continue-btn') as HTMLButtonElement).click();

    const correct = pinState().currentChallenge!.correctAnswer;
    (
      Array.from(pinRoot.querySelectorAll('.pinball-choice-btn')).find(
        (el) => el.textContent === correct
      ) as HTMLButtonElement
    ).click();
    (
      pinRoot.querySelector('.pinball-continue-btn') as HTMLButtonElement
    ).click();

    expect(fracState().currentPlayer).toBe('player2');
    expect(pinState().currentPlayer).toBe('player2');
    expect(fracRoot.querySelector('.frac-status.player2')?.textContent).toMatch(
      /Red's turn/
    );
    expect(
      pinRoot.querySelector('.pinball-status.player2')?.textContent
    ).toMatch(/Red's turn/);
  });
});
