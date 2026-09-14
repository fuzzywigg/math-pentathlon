/**
 * Wave 56 leftover after #256 — Stars controller Select a card / place copy. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/stars-bars/game-controller';
import { selectCard } from '../../src/games/stars-bars/rules';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('stars-styles')?.remove();
});

describe('Wave 56 stars — controller status', () => {
  it('opening Select a card; placing green-cell copy', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const ctrl = newGameVsHuman(el);
    expect(el.querySelector('.stars-status')?.textContent).toMatch(
      /Blue's turn - Select a card/
    );
    ctrl.state = selectCard(ctrl.state, ctrl.state.playerHands.player1[0]!.id);
    ctrl.update();
    expect(el.querySelector('.stars-status')?.textContent).toMatch(
      /Blue - Place card on a green cell/
    );
  });
});
