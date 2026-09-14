/**
 * Wave 56 leftover after #256 — Calla animating phase pits ignore click.
 * Distinct from gameOver no-click leftover. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 56 calla — animating no pit click', () => {
  it('animating phase yields no valid pits and swallows clicks', () => {
    const onPit = vi.fn();
    const el = document.createElement('div');
    renderBoard(
      { ...createInitialState(), phase: 'animating' },
      el,
      onPit
    );
    expect(el.querySelectorAll('.calla-pit-valid').length).toBe(0);
    const pit = el.querySelector(
      '.calla-pit[data-side="player1"][data-pit-index="0"]'
    ) as SVGElement;
    pit.dispatchEvent(new Event('click', { bubbles: true }));
    expect(onPit).not.toHaveBeenCalled();
  });
});
