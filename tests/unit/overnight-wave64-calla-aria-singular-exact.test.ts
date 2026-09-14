/**
 * Wave 64 leftover after tip/#301 + open #303 wave63 — Calla singular pit aria exact.
 * Soft /1 cube/ in wave56; lock full valid-move label. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 64 calla — singular Blue pit aria exact', () => {
  it('locks Blue pit 1, Blue, 1 cube, valid move', () => {
    const el = document.createElement('div');
    renderBoard(
      { ...createInitialState(), player1Pits: [1, 0, 0, 0, 0] },
      el
    );
    expect(
      el
        .querySelector('.calla-pit[data-side="player1"][data-pit-index="0"]')
        ?.getAttribute('aria-label')
    ).toBe('Blue pit 1, Blue, 1 cube, valid move');
  });
});
