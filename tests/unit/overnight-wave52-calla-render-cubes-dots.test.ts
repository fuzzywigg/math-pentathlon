/**
 * Overnight HEAVY leftover after #234 — Calla cube-dot indicators for 1–6. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 52 calla — cube dots', () => {
  it('renders one calla-cube per cube when pit count is 1–6', () => {
    const s = {
      ...createInitialState(),
      player1Pits: [1, 2, 3, 4, 6],
      player2Pits: [0, 0, 0, 0, 0],
    };
    const el = document.createElement('div');
    renderBoard(s, el);
    const pit0 = el.querySelector('.calla-pit-p1[data-pit-index="0"]');
    const pit4 = el.querySelector('.calla-pit-p1[data-pit-index="4"]');
    expect(pit0?.querySelectorAll('.calla-cube').length).toBe(1);
    expect(pit4?.querySelectorAll('.calla-cube').length).toBe(6);
    const empty = el.querySelector('.calla-pit-p2[data-pit-index="0"]');
    expect(empty?.querySelectorAll('.calla-cube').length).toBe(0);
  });
});
