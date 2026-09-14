/**
 * Wave 57 leftover after #263 — Hex-a-Gone HvH Blue Wins! status. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { renderStatus } from '../../src/games/hex-a-gone/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 57 hexagone — Blue wins status', () => {
  it('HvH player1 winner shows Blue Wins!', () => {
    const state = {
      ...createInitialState(),
      winner: 'player1' as const,
      phase: 'gameOver' as const,
    };
    const el = document.createElement('div');
    renderStatus(state, el);
    const turn = el.querySelector('.status-turn');
    expect(turn?.classList.contains('status-winner')).toBe(true);
    expect(turn?.textContent).toBe('🎉 🔵 Blue Wins! 🎉');
  });
});
