/**
 * Wave 58 leftover after #267 — Pent Enter activates empty cell.
 * Distinct from Space leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { renderBoard } from '../../src/games/pent-em-in/board-ui';

describe('Wave 58 pent — keydown Enter', () => {
  it('Enter on empty interaction cell fires onCellClick', () => {
    let clicked: { row: number; col: number } | null = null;
    const svg = renderBoard(
      createInitialState(),
      (coord) => {
        clicked = coord;
      },
      () => undefined
    );
    const cell = svg.querySelector('.interaction [data-row="1"][data-col="1"]')!;
    cell.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(clicked).toEqual({ row: 1, col: 1 });
  });
});
