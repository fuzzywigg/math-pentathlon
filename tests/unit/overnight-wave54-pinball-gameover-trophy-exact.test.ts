/**
 * Wave 54 leftover after #240 — Pinball trophy banners exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderGameOver } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 54 pinball — trophy banners', () => {
  it('uses Blue/Red Wins! 🏆 copy', () => {
    const base = createInitialState();
    expect(
      renderGameOver({ ...base, winner: 'player1' }).querySelector(
        '.pinball-winner-banner'
      )?.textContent
    ).toBe('Blue Wins! 🏆');
    expect(
      renderGameOver({ ...base, winner: 'player2' }).querySelector(
        '.pinball-winner-banner'
      )?.textContent
    ).toBe('Red Wins! 🏆');
  });
});
