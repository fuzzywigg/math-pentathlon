/**
 * Wave 52 — Star Track draw/select callbacks leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { drawChains } from '../../src/games/star-track/rules';
import { renderBoard } from '../../src/games/star-track/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 52 star-track — draw/select callbacks', () => {
  it('fires onDrawChains and onSelectChain(0)', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    let drew = false;
    renderBoard(createInitialState(), container, () => {
      drew = true;
    });
    container
      .querySelector('.star-track-draw-btn')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(drew).toBe(true);

    let selected: 0 | 1 | null = null;
    const drawn = drawChains(createInitialState());
    renderBoard(drawn, container, undefined, (idx) => {
      selected = idx;
    });
    container
      .querySelectorAll('.star-track-chain-btn')[0]!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(selected).toBe(0);
  });
});
