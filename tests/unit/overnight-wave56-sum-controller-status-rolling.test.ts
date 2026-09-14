/**
 * Wave 56 leftover after #243 — Sum Dominoes controller rolling status residual.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 56 sum — controller status rolling', () => {
  it('opens on Blue turn roll copy with .sd-status.player1', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    initGame(root, false);
    const status = root.querySelector('.sd-status.player1');
    expect(status?.getAttribute('aria-live')).toBe('polite');
    expect(status?.textContent).toMatch(/Blue's turn - Roll the dice/);
  });
});
