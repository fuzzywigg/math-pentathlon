/**
 * Wave 56 leftover after #256 — Calla empty pit is not valid and ignores click.
 * Distinct from wave50/52 valid-pit click leftovers. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 56 calla — empty pit no click', () => {
  it('empty P1 pit lacks valid class/pointer and does not fire callback', () => {
    const onPit = vi.fn();
    const el = document.createElement('div');
    renderBoard(
      {
        ...createInitialState(),
        player1Pits: [0, 3, 3, 3, 3],
      },
      el,
      onPit
    );
    const empty = el.querySelector(
      '.calla-pit[data-side="player1"][data-pit-index="0"]'
    ) as SVGElement;
    expect(empty.classList.contains('calla-pit-valid')).toBe(false);
    expect(empty.style.cursor).not.toBe('pointer');
    empty.dispatchEvent(new Event('click', { bubbles: true }));
    empty.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(onPit).not.toHaveBeenCalled();

    const filled = el.querySelector(
      '.calla-pit[data-side="player1"][data-pit-index="1"]'
    ) as SVGElement;
    expect(filled.classList.contains('calla-pit-valid')).toBe(true);
    filled.dispatchEvent(new Event('click', { bubbles: true }));
    expect(onPit).toHaveBeenCalledWith(1);
  });
});
