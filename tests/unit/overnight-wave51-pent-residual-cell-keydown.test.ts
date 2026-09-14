/**
 * Overnight TOKENMAXX HEAVY leftovers after #234 — Pent board cell keydown a11y.
 * Distinct from wave50 mouseenter/leave/click leftovers. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { renderBoard } from '../../src/games/pent-em-in/board-ui';

describe('Wave 51 pent residual — cell keydown', () => {
  it('Enter and Space on interaction cell fire onCellClick', () => {
    const onClick = vi.fn();
    const onHover = vi.fn();
    const svg = renderBoard(createInitialState(), onClick, onHover);
    const cell = svg.querySelector(
      '.interaction [data-row="1"][data-col="4"]'
    ) as SVGElement;
    expect(cell).toBeTruthy();

    cell.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(onClick).toHaveBeenCalledWith({ row: 1, col: 4 });

    onClick.mockClear();
    cell.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true })
    );
    expect(onClick).toHaveBeenCalledWith({ row: 1, col: 4 });
  });
});
