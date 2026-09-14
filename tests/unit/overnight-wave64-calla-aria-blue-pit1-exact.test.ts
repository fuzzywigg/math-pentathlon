/**
 * Wave 64 leftover after tip/#301 + open #303 wave63 — Calla opening Blue pit aria exact.
 * Soft /Blue pit/ /3 cubes/ /valid move/ in wave50. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 64 calla — opening Blue pit aria exact', () => {
  it('locks Blue pit 1 full aria with valid move', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(), el);
    expect(
      el
        .querySelector('.calla-pit[data-side="player1"][data-pit-index="0"]')
        ?.getAttribute('aria-label')
    ).toBe('Blue pit 1, Blue, 3 cubes, valid move');
  });
});
