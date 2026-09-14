/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact exact Blue turn status.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame } from '../../src/games/frac-fact/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 56 frac controller — Blue turn exact', () => {
  it('status text is 🔵 Blue\'s turn leftover', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    initGame(root);
    expect(root.querySelector('.frac-status')?.textContent).toBe("🔵 Blue's turn");
  });
});
