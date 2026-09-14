/**
 * Wave 56 leftover after #256 — Stars Clear Selection control. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/stars-bars/game-controller';
import { selectCard } from '../../src/games/stars-bars/rules';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('stars-styles')?.remove();
});

describe('Wave 56 stars — Clear Selection', () => {
  it('shows Clear Selection and restores selectingCard', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const ctrl = newGameVsHuman(el);
    ctrl.state = selectCard(ctrl.state, ctrl.state.playerHands.player1[0]!.id);
    ctrl.update();
    const btn = [...el.querySelectorAll('.stars-btn-secondary')].find((b) =>
      /Clear Selection/.test(b.textContent ?? '')
    );
    expect(btn).toBeTruthy();
    btn!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ctrl.state.selectedCard).toBeNull();
    expect(ctrl.state.phase).toBe('selectingCard');
  });
});
