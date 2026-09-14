/**
 * Wave 56 leftover after #256 — Hex HvH Blue/Red turn exact copy. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { renderStatus } from '../../src/games/hex/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 56 hex — HvH turn copy', () => {
  it("Blue's and Red's turn - Click to place", () => {
    const el = document.createElement('div');
    renderStatus(createInitialState(5), el, 'human-vs-human');
    expect(el.querySelector('.status-turn')?.textContent).toBe(
      "Blue's turn - Click to place"
    );
    renderStatus(
      { ...createInitialState(5), currentPlayer: 'player2' },
      el,
      'human-vs-human'
    );
    expect(el.querySelector('.status-turn')?.textContent).toBe(
      "Red's turn - Click to place"
    );
  });
});
