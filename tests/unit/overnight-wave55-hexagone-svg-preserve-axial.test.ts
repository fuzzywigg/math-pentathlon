/**
 * Wave 55 leftover after #250 — Hex-a-Gone preserveAspectRatio + axial stamps. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { renderBoard } from '../../src/games/hex-a-gone/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 55 hexagone — svg chrome', () => {
  it('meet aspect + cells group + row/col = r/q', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(), el);
    const svg = el.querySelector('.hex-a-gone-board');
    expect(svg?.getAttribute('preserveAspectRatio')).toBe('xMidYMid meet');
    expect(el.querySelector('.hex-a-gone-cells')).toBeTruthy();
    const cell = el.querySelector('.hex-a-gone-cell') as SVGElement;
    expect(cell.getAttribute('data-row')).toBe(cell.getAttribute('data-r'));
    expect(cell.getAttribute('data-col')).toBe(cell.getAttribute('data-q'));
  });
});
