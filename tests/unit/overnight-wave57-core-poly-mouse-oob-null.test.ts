/**
 * Overnight HEAVY leftover after #264 — getCellFromMouseEvent OOB → null.
 * Distinct from wave56 in-bounds cell mapping. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  createBoard,
  renderBoard,
  getCellFromMouseEvent,
} from '../../src/core/polyomino';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 57 core poly-ui — mouse OOB', () => {
  it('coords left of padding return null', () => {
    const svg = renderBoard(createBoard(3, 3), [], {
      cellSize: 10,
      padding: 5,
    });
    Object.defineProperty(svg, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 40, height: 40 }),
    });
    expect(
      getCellFromMouseEvent(
        new MouseEvent('click', { clientX: 1, clientY: 20 }),
        svg,
        { cellSize: 10, padding: 5 }
      )
    ).toBeNull();
  });
});
