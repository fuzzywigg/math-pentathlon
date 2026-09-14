/**
 * Wave 56 leftover after #256 — Par 55 Clear Selection control. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/par-55/game-controller';
import { selectBlock } from '../../src/games/par-55/rules';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('par55-styles')?.remove();
});

describe('Wave 56 par55 — Clear Selection', () => {
  it('shows Clear Selection and restores selectingBlock', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const ctrl = newGameVsHuman(el);
    ctrl.state = selectBlock(ctrl.state, ctrl.state.hands.player1[0]!.id);
    ctrl.update();
    const btn = [...el.querySelectorAll('.par55-btn-secondary')].find((b) =>
      /Clear Selection/.test(b.textContent ?? '')
    );
    expect(btn).toBeTruthy();
    btn!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ctrl.state.selectedBlock).toBeNull();
    expect(ctrl.state.phase).toBe('selectingBlock');
  });
});
