/**
 * Wave 49 — Frac-fact gameOver banners. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderGameOver } from '../../src/games/frac-fact/board-ui';

describe('Wave 49 frac-fact — gameOver banners', () => {
  it('covers p1 / p2 / draw', () => {
    const base = createInitialState();
    expect(renderGameOver({ ...base, winner: 'player1' }).querySelector('.frac-winner-banner')?.textContent).toMatch(/Blue Wins/);
    expect(renderGameOver({ ...base, winner: 'player2' }).querySelector('.frac-winner-banner')?.textContent).toMatch(/Red Wins/);
    expect(renderGameOver({ ...base, winner: null }).querySelector('.frac-winner-banner')?.textContent).toMatch(/Draw/);
  });
});
