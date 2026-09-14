/**
 * Wave 57 leftover after #263 — Par 55 placing-phase status exact. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/par-55/game-controller';
import { selectBlock } from '../../src/games/par-55/rules';

describe('Wave 57 par55 — placing status', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('par55-styles')?.remove();
  });

  it('after selectBlock shows Place block on a green base', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    const blockId = ctrl.state.hands.player1[0]!.id;
    ctrl.state = selectBlock(ctrl.state, blockId);
    ctrl.update();
    expect(root.querySelector('.par55-status')?.textContent).toBe(
      '🔵 Blue - Place block on a green base'
    );
  });
});
