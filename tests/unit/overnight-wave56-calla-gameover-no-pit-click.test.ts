/**
 * Wave 56 leftover after #256 — Calla gameOver pits ignore click.
 * Distinct from empty-pit leftover; winner freezes interaction. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 56 calla — gameOver no pit click', () => {
  it('gameOver phase yields no valid pits and no callback fires', () => {
    const onPit = vi.fn();
    const el = document.createElement('div');
    renderBoard(
      {
        ...createInitialState(),
        phase: 'gameOver',
        winner: 'player1',
        player1Pits: [3, 3, 3, 3, 3],
      },
      el,
      onPit
    );
    expect(el.querySelectorAll('.calla-pit-valid').length).toBe(0);
    const pit = el.querySelector(
      '.calla-pit[data-side="player1"][data-pit-index="0"]'
    ) as SVGElement;
    pit.dispatchEvent(new Event('click', { bubbles: true }));
    pit.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(onPit).not.toHaveBeenCalled();
  });
});
