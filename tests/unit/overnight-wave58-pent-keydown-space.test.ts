/**
 * Wave 58 leftover after #267 — Pent Space activates empty cell.
 * Distinct from empty aria leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { renderBoard } from '../../src/games/pent-em-in/board-ui';

describe('Wave 58 pent — keydown Space', () => {
  it('Space on empty interaction cell fires onCellClick', () => {
    let clicked: { row: number; col: number } | null = null;
    const svg = renderBoard(
      createInitialState(),
      (coord) => {
        clicked = coord;
      },
      () => undefined
    );
    const cell = svg.querySelector('.interaction [data-row="0"][data-col="0"]')!;
    cell.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(clicked).toEqual({ row: 0, col: 0 });
  });
});
