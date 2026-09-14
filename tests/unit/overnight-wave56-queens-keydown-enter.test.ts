/**
 * Wave 56 leftover after #256 — Queens Enter key activates cell click.
 * Distinct from wave52 click-coord leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 56 queens — keydown Enter', () => {
  it('Enter on data-cell-key fires onCellClick with ring/position', () => {
    let clicked: { ring: number; position: number } | null = null;
    const svg = renderBoard(createInitialState(), (coord) => {
      clicked = coord;
    });
    const g = svg.querySelector('[data-cell-key="0-0"]')!;
    g.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(clicked).toEqual({ ring: 0, position: 0 });
  });
});
