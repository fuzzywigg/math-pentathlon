/**
 * Wave 57 leftover after #262 — Calla human-vs-human winner banner.
 * Distinct from tie exact + AI You/AI labels. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderStatus } from '../../src/games/calla/board-ui';

describe('Wave 57 calla — winner banner exact', () => {
  it('renders Blue Wins banner with seat icon', () => {
    const state = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    const el = document.createElement('div');
    renderStatus(state, el, 'human-vs-human');
    expect(el.querySelector('.status-winner')?.textContent).toBe(
      '🎉 🔵 Blue Wins! 🎉'
    );
  });

  it('renders Red Wins banner for player2', () => {
    const state = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player2' as const,
    };
    const el = document.createElement('div');
    renderStatus(state, el, 'human-vs-human');
    expect(el.querySelector('.status-winner')?.textContent).toBe(
      '🎉 🔴 Red Wins! 🎉'
    );
  });
});
