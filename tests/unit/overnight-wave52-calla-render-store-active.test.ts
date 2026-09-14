/**
 * Overnight HEAVY leftover after #234 — Calla store active seat chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 52 calla — store-active', () => {
  it('marks only current player store as active', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(), el);
    expect(el.querySelector('.calla-store-p1.calla-store-active')).toBeTruthy();
    expect(el.querySelector('.calla-store-p2.calla-store-active')).toBeFalsy();

    const el2 = document.createElement('div');
    renderBoard({ ...createInitialState(), currentPlayer: 'player2' }, el2);
    expect(el2.querySelector('.calla-store-p2.calla-store-active')).toBeTruthy();
    expect(el2.querySelector('.calla-store-p1.calla-store-active')).toBeFalsy();
  });
});
