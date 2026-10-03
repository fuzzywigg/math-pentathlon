/**
 * ON-20260928-W1-MP-FINISH item 3 — Hex-a-Gone Space places on the focused cell.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { createInitialState } from '../../src/games/hex-a-gone/types';
import { selectBlock, commitSelection } from '../../src/games/hex-a-gone/rules';
import { renderBoard } from '../../src/games/hex-a-gone/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

function placeBlocksState() {
  let state = createInitialState();
  for (const s of [
    'triangle',
    'square',
    'rhombus',
    'hexagon',
    'trapezoid',
  ] as const) {
    if (state.bank[s] > 0) {
      state = selectBlock(state, s);
      break;
    }
  }
  return commitSelection(state);
}

describe('MP-FINISH item 3 — Hex-a-Gone Space places', () => {
  it('Space on a focused valid cell invokes onCellClick like Enter/click', () => {
    const state = placeBlocksState();
    expect(state.phase).toBe('placeBlocks');

    const container = document.createElement('div');
    document.body.appendChild(container);
    const onClick = vi.fn();
    renderBoard(state, container, onClick);

    const valid = container.querySelector(
      '.hex-a-gone-cell-valid'
    ) as SVGElement;
    expect(valid).toBeTruthy();
    valid.focus();

    valid.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true })
    );
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith(
      Number(valid.getAttribute('data-q')),
      Number(valid.getAttribute('data-r'))
    );

    // code=Space alone (key not the space character) also places
    onClick.mockClear();
    valid.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Space',
        code: 'Space',
        bubbles: true,
      })
    );
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('Enter still places (regression)', () => {
    const state = placeBlocksState();
    const container = document.createElement('div');
    document.body.appendChild(container);
    const onClick = vi.fn();
    renderBoard(state, container, onClick);
    const valid = container.querySelector(
      '.hex-a-gone-cell-valid'
    ) as SVGElement;
    valid.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
