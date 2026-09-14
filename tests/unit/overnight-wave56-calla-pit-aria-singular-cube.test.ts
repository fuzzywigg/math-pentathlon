/**
 * Wave 56 leftover after #256 — Calla pit aria singular "1 cube".
 * Distinct from wave50 opening "3 cubes". Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 56 calla — pit aria singular cube', () => {
  it('labels a one-cube pit without plural s', () => {
    const el = document.createElement('div');
    renderBoard(
      {
        ...createInitialState(),
        player1Pits: [1, 3, 3, 3, 3],
      },
      el,
      () => undefined
    );
    const pit = el.querySelector(
      '.calla-pit[data-side="player1"][data-pit-index="0"]'
    );
    expect(pit?.getAttribute('aria-label')).toMatch(/1 cube(?!s)/);
    expect(pit?.getAttribute('aria-label')).toMatch(/Blue pit 1/);
    expect(pit?.getAttribute('aria-label')).toMatch(/valid move/);
  });
});
