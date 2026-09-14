/**
 * Wave 64 leftover after tip/#301 + open #303 wave63 — Calla pit0 cx geometry.
 * Distinct from wave64 cy lock. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 64 calla — pit0 cx geometry', () => {
  it('locks leftmost P1/P2 pit circles at cx 108', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(), el);
    expect(
      el
        .querySelector(
          '.calla-pit[data-side="player1"][data-pit-index="0"] .calla-pit-circle'
        )
        ?.getAttribute('cx')
    ).toBe('108');
    expect(
      el
        .querySelector(
          '.calla-pit[data-side="player2"][data-pit-index="4"] .calla-pit-circle'
        )
        ?.getAttribute('cx')
    ).toBe('108');
  });
});
