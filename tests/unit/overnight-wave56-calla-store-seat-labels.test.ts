/**
 * Wave 56 leftover after #256 — Calla store seatIcon labels present.
 * Distinct from wave52 store counts/active. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';
import { seatIcon } from '../../src/ui/player-colors';

describe('Wave 56 calla — store seat labels', () => {
  it('labels both stores with seat icons', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(), el);
    const labels = [...el.querySelectorAll('.calla-store-label')].map(
      (n) => n.textContent
    );
    expect(labels).toContain(seatIcon('player1'));
    expect(labels).toContain(seatIcon('player2'));
    expect(el.querySelector('.calla-store-p1.calla-store-active')).toBeTruthy();
    expect(el.querySelector('.calla-store-p2.calla-store-active')).toBeFalsy();
  });
});
