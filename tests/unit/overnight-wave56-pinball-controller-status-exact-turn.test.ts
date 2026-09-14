/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball exact Blue turn status.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame } from '../../src/games/fraction-pinball/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 56 pinball controller — Blue turn exact', () => {
  it('status text is 🔵 Blue\'s turn leftover', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    initGame(root);
    expect(root.querySelector('.pinball-status')?.textContent).toBe(
      "🔵 Blue's turn"
    );
  });
});
