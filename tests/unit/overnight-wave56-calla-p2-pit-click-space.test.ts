/**
 * Wave 56 leftover after #256 — Calla P2 pit click + Space when Red to move.
 * Distinct from wave50 P1 aria/click and wave50 P2 reverse display. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 56 calla — P2 pit click Space', () => {
  it('activates Red valid pits via click and Space', () => {
    const onPit = vi.fn();
    const el = document.createElement('div');
    renderBoard(
      { ...createInitialState(), currentPlayer: 'player2' },
      el,
      onPit
    );
    const pit = el.querySelector(
      '.calla-pit[data-side="player2"].calla-pit-valid[data-pit-index="2"]'
    ) as SVGElement;
    expect(pit).toBeTruthy();
    expect(pit.style.cursor).toBe('pointer');
    expect(pit.getAttribute('aria-label')).toMatch(/Red pit 3/);
    pit.dispatchEvent(new Event('click', { bubbles: true }));
    pit.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(onPit).toHaveBeenCalledWith(2);
    expect(onPit).toHaveBeenCalledTimes(2);
  });
});
