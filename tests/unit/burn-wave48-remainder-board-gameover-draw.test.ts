/**
 * Wave 48 — Remainder renderGameOver draw/p1/p2. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { renderGameOver } from '../../src/games/remainder-islands/board-ui';

describe('Wave 48 remainder — game over banners', () => {
  it('draw / blue / red banners', () => {
    const base = { ...createInitialState(), phase: 'gameOver' as const, player1Score: 5, player2Score: 5, winner: null };
    expect(renderGameOver(base).textContent).toMatch(/Draw/i);
    expect(renderGameOver({ ...base, winner: 'player1', player1Score: 9 }).textContent).toMatch(/Blue Wins/i);
    expect(renderGameOver({ ...base, winner: 'player2', player2Score: 9 }).textContent).toMatch(/Red Wins/i);
  });
});
