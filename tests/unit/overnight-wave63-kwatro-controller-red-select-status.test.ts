/**
 * Overnight TOKENMAXX HEAVY leftovers after #301 — Kwatro Red select status exact.
 * Wave57 locks Blue opening select; deepen Red after pass. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/kwatro-sinko/game-controller';
import { passTurn } from '../../src/games/kwatro-sinko/rules';

describe('Wave 63 kwatro — red select status', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('kwa-styles')?.remove();
  });

  it("after passTurn shows Red's turn - Select a chip to move", () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    ctrl.state = passTurn(ctrl.state);
    ctrl.update();
    expect(root.querySelector('.kwa-status')?.textContent).toBe(
      "🔴 Red's turn - Select a chip to move"
    );
    expect(root.querySelector('.kwa-status')?.classList.contains('player2')).toBe(
      true
    );
  });
});
