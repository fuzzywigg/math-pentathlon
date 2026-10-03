/**
 * Wave 57 leftover after #263 — Kwatro opening select-chip status exact. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/kwatro-sinko/game-controller';

describe('Wave 57 kwatro — select status', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('kwa-styles')?.remove();
  });

  it("opening shows Blue's turn - Select a chip to move", () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    newGameVsHuman(root);
    expect(root.querySelector('.kwa-status')?.textContent).toBe(
      "🔵 Blue's turn - Select a chip to move"
    );
  });
});
