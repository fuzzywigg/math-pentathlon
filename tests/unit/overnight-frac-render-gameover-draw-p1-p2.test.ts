/**
 * Overnight TOKENMAXX — Frac-Fact renderGameOver leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderGameOver } from '../../src/games/frac-fact/board-ui';

describe('Overnight frac-fact — renderGameOver', () => {
  it('draw / Blue / Red banners', () => {
    const base = { ...createInitialState('easy'), phase: 'gameOver' as const };
    expect(renderGameOver({ ...base, winner: null }).textContent).toMatch(/Draw/i);
    expect(renderGameOver({ ...base, winner: 'player1' }).textContent).toMatch(/Blue/i);
    expect(renderGameOver({ ...base, winner: 'player2' }).textContent).toMatch(/Red/i);
  });
});
