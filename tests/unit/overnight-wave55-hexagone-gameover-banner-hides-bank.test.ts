/**
 * Wave 55 leftover after #250 — Hex-a-Gone game-over board banner hides bank. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { renderBoard } from '../../src/games/hex-a-gone/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 55 hexagone — game-over banner', () => {
  it('Blue wins banner and no bank buttons', () => {
    const el = document.createElement('div');
    renderBoard(
      { ...createInitialState(), phase: 'gameOver', winner: 'player1' },
      el
    );
    expect(el.querySelector('.hex-a-gone-winner.game-winner-banner')?.textContent).toBe(
      '🎉 Blue wins! 🎉'
    );
    expect(el.querySelector('.hex-a-gone-bank')).toBeNull();
    expect(el.querySelector('.hex-a-gone-block-btn')).toBeNull();
  });
});
