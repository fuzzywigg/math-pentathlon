/**
 * Wave 57 leftover after #263 — Hex-a-Gone cell Enter/Space activate. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { selectBlock, commitSelection } from '../../src/games/hex-a-gone/rules';
import { renderBoard } from '../../src/games/hex-a-gone/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 57 hexagone — cell keydown', () => {
  it('Enter/Space on empty valid cell calls onCellClick', () => {
    const onClick = vi.fn();
    const placing = commitSelection(selectBlock(createInitialState(), 'triangle'));
    const el = document.createElement('div');
    renderBoard(placing, el, onClick);
    const cell = el.querySelector(
      '.hex-a-gone-cell[data-q="0"][data-r="0"]'
    ) as SVGGElement;
    expect(cell).toBeTruthy();
    cell.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(onClick).toHaveBeenCalled();
    const [q, r] = onClick.mock.calls[0]!;
    onClick.mockClear();
    cell.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true })
    );
    expect(onClick).toHaveBeenCalledWith(q, r);
  });
});
