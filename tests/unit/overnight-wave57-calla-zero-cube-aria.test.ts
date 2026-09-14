/**
 * Wave 57 leftover after #262 — Calla zero-cube plural aria.
 * Distinct from wave56 singular "1 cube". Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 57 calla — zero cube aria', () => {
  it('labels emptied pit with plural 0 cubes', () => {
    const state = createInitialState();
    state.player1Pits[0] = 0;
    const el = document.createElement('div');
    renderBoard(state, el);
    const pit = el.querySelector('.calla-pit-p1[data-pit-index="0"]');
    expect(pit?.getAttribute('aria-label')).toMatch(/0 cubes/);
  });
});
