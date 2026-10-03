/**
 * Wave 59 leftover after #272 — Frac Fact exact Blue turn with seat icon.
 * Distinct from wave57 Red's turn regex. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame } from '../../src/games/frac-fact/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 59 frac — blue turn exact', () => {
  it("opens with exact 🔵 Blue's turn", () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    initGame(root);
    expect(root.querySelector('.frac-status')?.textContent).toBe(
      "🔵 Blue's turn"
    );
  });
});
