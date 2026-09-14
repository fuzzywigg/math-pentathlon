/**
 * Wave 64 leftover after tip/#301 + open #303 wave63 — Calla empty pit aria exact.
 * Soft /0 cubes/ in wave58; lock full Blue empty label. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 64 calla — empty Blue pit aria exact', () => {
  it('locks Blue pit 1 with 0 cubes (no valid move)', () => {
    const el = document.createElement('div');
    renderBoard(
      { ...createInitialState(), player1Pits: [0, 3, 3, 3, 3] },
      el
    );
    expect(
      el
        .querySelector('.calla-pit[data-side="player1"][data-pit-index="0"]')
        ?.getAttribute('aria-label')
    ).toBe('Blue pit 1, Blue, 0 cubes');
  });
});
