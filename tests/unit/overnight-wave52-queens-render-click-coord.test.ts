/**
 * Wave 52 — Queens click coord leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 52 queens — click coord', () => {
  it('fires onCellClick with ring/position for data-cell-key', () => {
    let clicked: { ring: number; position: number } | null = null;
    const svg = renderBoard(createInitialState(), (coord) => {
      clicked = coord;
    });
    const g = svg.querySelector('[data-cell-key="0-0"]')!;
    g.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(clicked).toEqual({ ring: 0, position: 0 });
  });
});
