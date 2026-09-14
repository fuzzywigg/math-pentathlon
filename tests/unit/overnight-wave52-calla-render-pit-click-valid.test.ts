/**
 * Overnight HEAVY leftover after #234 — Calla valid pit click callback. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 52 calla — valid pit click', () => {
  it('fires onPitClick with pit index for a valid p1 pit', () => {
    const el = document.createElement('div');
    const onClick = vi.fn();
    renderBoard(createInitialState(), el, onClick);
    const pit = el.querySelector('.calla-pit-p1.calla-pit-valid[data-pit-index="1"]') as SVGElement;
    expect(pit).toBeTruthy();
    pit.dispatchEvent(new Event('click', { bubbles: true }));
    expect(onClick).toHaveBeenCalledWith(1);
  });
});
