/**
 * Wave 56 leftover after #255/#256 — Fab Clear Selection control. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/fab-a-diffy/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 56 fab — clear selection', () => {
  it('exact Clear Selection label resets bar1 phase', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const ctrl = newGameVsHuman(container);

    const bar = container.querySelector(
      '.fab-bar-wrapper:not(.fab-bar-disabled)'
    ) as HTMLElement;
    expect(bar).toBeTruthy();
    bar.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ctrl.state.phase).toBe('selectingBar2');
    expect(ctrl.state.selectedBar1).toBeTruthy();

    const clear = [...container.querySelectorAll('.fab-btn-secondary')].find(
      (b) => b.textContent === 'Clear Selection'
    );
    expect(clear).toBeTruthy();
    clear!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ctrl.state.phase).toBe('selectingBar1');
    expect(ctrl.state.selectedBar1).toBeNull();
    expect(ctrl.state.selectedBar2).toBeNull();
  });
});
