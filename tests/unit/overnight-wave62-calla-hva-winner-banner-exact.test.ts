/**
 * Wave 62 leftover after #293 — Calla HvA You/AI winner banner exact.
 * Distinct from wave58 HvH Blue/Red banners and wave59 You/AI scores. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderStatus } from '../../src/games/calla/board-ui';

describe('Wave 62 calla — hva winner banner exact', () => {
  it('renders You Wins / AI Wins banners with seat icons', () => {
    const el = document.createElement('div');
    renderStatus(
      {
        ...createInitialState(),
        phase: 'gameOver',
        winner: 'player1',
      },
      el,
      'human-vs-ai'
    );
    expect(el.querySelector('.status-winner')?.textContent).toBe(
      '🎉 🔵 You Wins! 🎉'
    );

    renderStatus(
      {
        ...createInitialState(),
        phase: 'gameOver',
        winner: 'player2',
      },
      el,
      'human-vs-ai'
    );
    expect(el.querySelector('.status-winner')?.textContent).toBe(
      '🎉 🔴 AI Wins! 🎉'
    );
  });
});
