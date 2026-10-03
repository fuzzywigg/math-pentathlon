/**
 * Wave 57 leftover after #263 — Kwatro Clear Selection chrome. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/kwatro-sinko/game-controller';
import { selectChip } from '../../src/games/kwatro-sinko/rules';

describe('Wave 57 kwatro — clear selection', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('kwa-styles')?.remove();
  });

  it('shows Clear Selection and click clears selectedChip', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    ctrl.state = selectChip(ctrl.state, 'p1-0');
    ctrl.update();
    const btn = [...root.querySelectorAll('.kwa-btn-secondary')].find(
      (b) => b.textContent === 'Clear Selection'
    ) as HTMLButtonElement;
    expect(btn).toBeTruthy();
    btn.click();
    expect(ctrl.state.selectedChip).toBeNull();
    expect(ctrl.state.phase).toBe('selectingChip');
  });
});
