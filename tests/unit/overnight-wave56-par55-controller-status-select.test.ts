/**
 * Wave 56 leftover after #256 — Par 55 controller opening Select a block. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/par-55/game-controller';
import { selectBlock } from '../../src/games/par-55/rules';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('par55-styles')?.remove();
});

describe('Wave 56 par55 — controller status', () => {
  it('opening Select a block; placing green-base copy', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const ctrl = newGameVsHuman(el);
    expect(el.querySelector('.par55-status')?.textContent).toMatch(
      /Blue's turn - Select a block/
    );
    ctrl.state = selectBlock(ctrl.state, ctrl.state.hands.player1[0]!.id);
    ctrl.update();
    expect(el.querySelector('.par55-status')?.textContent).toMatch(
      /Blue - Place block on a green base/
    );
  });
});
