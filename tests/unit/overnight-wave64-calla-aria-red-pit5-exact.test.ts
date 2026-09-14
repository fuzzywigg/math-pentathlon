/**
 * Wave 64 leftover after tip/#301 + open #303 wave63 — Calla inactive Red pit aria exact.
 * Soft /Red pit/ in wave50; lock full string without valid move. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 64 calla — opening Red pit5 aria exact', () => {
  it('locks Red pit 5 full aria without valid move', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(), el);
    expect(
      el
        .querySelector('.calla-pit[data-side="player2"][data-pit-index="4"]')
        ?.getAttribute('aria-label')
    ).toBe('Red pit 5, Red, 3 cubes');
  });
});
