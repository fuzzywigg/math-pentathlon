/**
 * Wave 59 leftover after #272 — Pinball exact Blue turn with seat icon.
 * Distinct from wave57 Red turn regex. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame } from '../../src/games/fraction-pinball/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 59 pinball — blue turn exact', () => {
  it("opens with exact 🔵 Blue's turn", () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    initGame(root);
    expect(root.querySelector('.pinball-status')?.textContent).toBe(
      "🔵 Blue's turn"
    );
  });
});
