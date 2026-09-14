/**
 * Wave 56 leftover after #256 — Hex-a-Gone Red wins banner. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { renderBoard } from '../../src/games/hex-a-gone/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 56 hexagone — Red wins', () => {
  it('Red wins banner text exact', () => {
    const el = document.createElement('div');
    renderBoard(
      { ...createInitialState(), phase: 'gameOver', winner: 'player2' },
      el
    );
    expect(el.querySelector('.hex-a-gone-winner.game-winner-banner')?.textContent).toBe(
      '🎉 Red wins! 🎉'
    );
  });
});
