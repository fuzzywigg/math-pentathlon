/**
 * Wave 56 leftover after #255/#256 — Fab bar clicks advance phases. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/fab-a-diffy/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 56 fab — bar click phases', () => {
  it('first bar → selectingBar2; second → selectingOperation + op chrome', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const ctrl = newGameVsHuman(container);

    const first = container.querySelector(
      '.fab-bar-wrapper:not(.fab-bar-disabled)'
    ) as HTMLElement;
    first.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ctrl.state.phase).toBe('selectingBar2');
    expect(ctrl.state.selectedBar1).toBe(first.dataset.barId);

    const second = [
      ...container.querySelectorAll('.fab-bar-wrapper:not(.fab-bar-disabled)'),
    ].find((el) => el !== first && !(el as HTMLElement).classList.contains('fab-bar-selected')) as
      | HTMLElement
      | undefined;
    expect(second).toBeTruthy();
    second!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ctrl.state.phase).toBe('selectingOperation');
    expect(ctrl.state.selectedBar2).toBe(second!.dataset.barId);
    expect(container.querySelector('.fab-operation-selector')).toBeTruthy();
    expect(container.querySelectorAll('.fab-op-btn').length).toBe(4);
  });
});
