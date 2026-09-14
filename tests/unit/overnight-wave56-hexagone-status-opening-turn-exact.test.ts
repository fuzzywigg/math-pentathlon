/**
 * Wave 56 leftover after #256 — Hex-a-Gone opening status-turn exact. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { renderStatus } from '../../src/games/hex-a-gone/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 56 hexagone — opening turn', () => {
  it("Blue's turn - Select 1-3 blocks from the bank", () => {
    const el = document.createElement('div');
    renderStatus(createInitialState(), el);
    expect(el.querySelector('.status-turn')?.textContent).toBe(
      "Blue's turn - Select 1-3 blocks from the bank"
    );
  });
});
