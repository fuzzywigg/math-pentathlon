/**
 * Wave 56 leftover after #256 — Kwatro Clear Selection control. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/kwatro-sinko/game-controller';
import { selectChip } from '../../src/games/kwatro-sinko/rules';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 56 kwatro — Clear Selection', () => {
  it('shows Clear Selection and restores selectingChip', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const ctrl = newGameVsHuman(el);
    ctrl.state = selectChip(ctrl.state, 'p1-0');
    ctrl.update();
    const btn = [...el.querySelectorAll('.kwa-btn-secondary')].find((b) =>
      /Clear Selection/.test(b.textContent ?? '')
    );
    expect(btn).toBeTruthy();
    btn!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ctrl.state.selectedChip).toBeNull();
    expect(ctrl.state.phase).toBe('selectingChip');
  });
});
