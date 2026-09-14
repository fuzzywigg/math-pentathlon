/**
 * Wave 57 leftover after #262 — Calla pit data-side attributes.
 * Distinct from data-pit-index coverage. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 57 calla — data-side attrs', () => {
  it('tags pits with player1 and player2 data-side', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(), el);
    expect(
      el.querySelectorAll('.calla-pit[data-side="player1"]').length
    ).toBe(5);
    expect(
      el.querySelectorAll('.calla-pit[data-side="player2"]').length
    ).toBe(5);
  });
});
