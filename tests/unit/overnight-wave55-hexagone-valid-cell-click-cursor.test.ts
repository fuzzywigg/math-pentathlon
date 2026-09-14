/**
 * Wave 55 leftover after #250 — Hex-a-Gone valid cell pointer + click wiring. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { selectBlock, commitSelection } from '../../src/games/hex-a-gone/rules';
import { renderBoard } from '../../src/games/hex-a-gone/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 55 hexagone — valid cell click', () => {
  it('valid cell is pointer and click reports q,r', () => {
    const placing = commitSelection(selectBlock(createInitialState(), 'triangle'));
    const onCell = vi.fn();
    const el = document.createElement('div');
    renderBoard(placing, el, onCell);
    const valid = el.querySelector('.hex-a-gone-cell-valid') as SVGElement;
    expect(valid).toBeTruthy();
    expect(valid.style.cursor).toBe('pointer');
    valid.dispatchEvent(new Event('click'));
    expect(onCell).toHaveBeenCalledTimes(1);
    const [q, r] = onCell.mock.calls[0];
    expect(typeof q).toBe('number');
    expect(typeof r).toBe('number');
  });
});
