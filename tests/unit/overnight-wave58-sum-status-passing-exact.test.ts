/**
 * Wave 58 Contig/SD residual — Sum passing status exact phrase. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 58 sum — passing status exact', () => {
  it('shows cannot play - must pass for current seat', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    ctrl.state = {
      ...ctrl.state,
      phase: 'passing',
      currentDice: [6, 6],
      currentPlayer: 'player1',
    };
    ctrl.update();
    expect(root.querySelector('.sd-status')?.textContent).toMatch(
      /Blue cannot play - must pass/
    );
    expect(root.querySelector('.sd-pass-btn')?.textContent).toBe('Pass Turn');
  });
});
