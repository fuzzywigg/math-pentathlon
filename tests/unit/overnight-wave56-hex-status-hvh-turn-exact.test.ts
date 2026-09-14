/**
 * Wave 56 leftover after #256 — Hex HvH Blue/Red turn copy. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { renderStatus } from '../../src/games/hex/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 56 hex — HvH turn', () => {
  it('Blue then Red Click to place strings', () => {
    const el = document.createElement('div');
    const open = createInitialState(5);
    renderStatus(open, el);
    expect(el.querySelector('.status-turn')?.textContent).toBe(
      "Blue's turn - Click to place"
    );
    renderStatus({ ...open, currentPlayer: 'player2' }, el);
    expect(el.querySelector('.status-turn')?.textContent).toBe(
      "Red's turn - Click to place"
    );
  });
});
