/**
 * Wave 57 leftover after #257 — Fab winner banner emoji. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/fab-a-diffy/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 57 fab — winner banner emoji', () => {
  it('Blue and Red banners include celebration emoji', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const ctrl = newGameVsHuman(container);

    ctrl.state = { ...ctrl.state, winner: 'player1', phase: 'gameOver' };
    ctrl.update();
    expect(
      container.querySelector('.fab-winner-banner')?.textContent
    ).toContain('🎉');
    expect(container.querySelector('.fab-winner-banner')?.textContent).toMatch(
      /Blue Wins!/
    );

    ctrl.state = { ...ctrl.state, winner: 'player2', phase: 'gameOver' };
    ctrl.update();
    expect(
      container.querySelector('.fab-winner-banner')?.textContent
    ).toContain('🎉');
    expect(container.querySelector('.fab-winner-banner')?.textContent).toMatch(
      /Red Wins!/
    );
  });
});
