/**
 * Wave 56 leftover after #256 — Stars tie status + banner. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/stars-bars/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('stars-styles')?.remove();
});

describe('Wave 56 stars — tie chrome', () => {
  it("It's a tie! status and It's a Tie! banner", () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const ctrl = newGameVsHuman(el);
    ctrl.state = { ...ctrl.state, phase: 'gameOver', winner: null };
    ctrl.update();
    expect(el.querySelector('.stars-status')?.textContent).toBe("It's a tie!");
    expect(el.querySelector('.stars-winner-banner')?.textContent).toBe(
      "It's a Tie!"
    );
  });
});
