/**
 * Wave 57 leftover after #263 — Par 55 Clear Selection chrome. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/par-55/game-controller';
import { selectBlock } from '../../src/games/par-55/rules';

describe('Wave 57 par55 — clear selection', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('par55-styles')?.remove();
  });

  it('shows Clear Selection and click returns to selectingBlock', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    ctrl.state = selectBlock(ctrl.state, ctrl.state.hands.player1[0]!.id);
    ctrl.update();
    const btn = [...root.querySelectorAll('.par55-btn-secondary')].find(
      (b) => b.textContent === 'Clear Selection'
    ) as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect(btn.classList.contains('par55-btn')).toBe(true);
    btn.click();
    expect(ctrl.state.selectedBlock).toBeNull();
    expect(ctrl.state.phase).toBe('selectingBlock');
  });
});
