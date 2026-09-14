/**
 * Wave 59 Contig/SD residual — Sum Pass Turn controller flip. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 59 sum — pass btn flip', () => {
  it('Pass Turn advances to rolling with passCount 1', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    ctrl.state = {
      ...ctrl.state,
      phase: 'passing',
      currentPlayer: 'player1',
      currentDice: [6, 6],
      passCount: 0,
    };
    ctrl.update();
    (root.querySelector('.sd-pass-btn') as HTMLButtonElement).click();
    expect(ctrl.state.phase).toBe('rolling');
    expect(ctrl.state.passCount).toBe(1);
    expect(ctrl.state.currentPlayer).toBe('player2');
  });
});
