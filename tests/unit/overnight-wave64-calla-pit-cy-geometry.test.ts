/**
 * Wave 64 leftover after tip/#301 + open #303 wave63 — Calla pit circle cy geometry.
 * Distinct from wave60 store size / wave62 board-bg. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 64 calla — pit circle cy geometry', () => {
  it('locks P2 cy float leftover and P1 cy 144', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(), el);
    expect(
      el
        .querySelector(
          '.calla-pit[data-side="player2"][data-pit-index="4"] .calla-pit-circle'
        )
        ?.getAttribute('cy')
    ).toBe('56.00000000000001');
    expect(
      el
        .querySelector(
          '.calla-pit[data-side="player1"][data-pit-index="0"] .calla-pit-circle'
        )
        ?.getAttribute('cy')
    ).toBe('144');
  });
});
