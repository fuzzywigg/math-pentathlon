/**
 * Wave 56 leftover after #256 — Par 55 controller Blue/Red hand count labels. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/par-55/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('par55-styles')?.remove();
});

describe('Wave 56 par55 — hand labels', () => {
  it('Blue (n) / Red (n) hand labels mount', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const ctrl = newGameVsHuman(el);
    const n1 = ctrl.state.hands.player1.length;
    const n2 = ctrl.state.hands.player2.length;
    expect(el.querySelector('.par55-hand-label.player1')?.textContent).toMatch(
      new RegExp(`Blue \\(${n1}\\)`)
    );
    expect(el.querySelector('.par55-hand-label.player2')?.textContent).toMatch(
      new RegExp(`Red \\(${n2}\\)`)
    );
  });
});
