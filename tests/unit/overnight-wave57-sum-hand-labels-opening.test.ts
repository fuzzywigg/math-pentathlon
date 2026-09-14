/**
 * Wave 57 leftover after #267 — Sum hand labels Blue/Red left counts. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 57 sum — hand labels', () => {
  it('labels Blue/Red hands with remaining counts', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    const p1 = root.querySelector('.sd-hand-label.player1')?.textContent ?? '';
    const p2 = root.querySelector('.sd-hand-label.player2')?.textContent ?? '';
    expect(p1).toMatch(
      new RegExp(`Blue \\(${ctrl.state.hands.player1.length} left\\)`)
    );
    expect(p2).toMatch(
      new RegExp(`Red \\(${ctrl.state.hands.player2.length} left\\)`)
    );
  });
});
