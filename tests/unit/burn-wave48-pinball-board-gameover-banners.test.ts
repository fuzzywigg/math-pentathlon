/**
 * Wave 48 — Pinball renderGameOver banners. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderGameOver } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 48 pinball — game over', () => {
  it('draw / blue / red', () => {
    const base = createInitialState();
    expect(renderGameOver({ ...base, winner: null }).textContent).toMatch(/Draw/i);
    expect(renderGameOver({ ...base, winner: 'player1' }).textContent).toMatch(/Blue Wins/i);
    expect(renderGameOver({ ...base, winner: 'player2' }).textContent).toMatch(/Red Wins/i);
  });
});
