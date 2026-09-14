/**
 * Wave 49 — Kings HvA You Win exact leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderStatus } from '../../src/games/kings-quadraphages/board-ui';

afterEach(() => { document.body.innerHTML = ''; });

describe('Wave 49 kings — You Win exact', () => {
  it('shows You Win when player1 wins vs AI', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const state = { ...createInitialGameState(), turnPhase: 'gameOver' as const, winner: 'player1' as const };
    renderStatus(state, el, 'human-vs-ai', 'medium', false);
    expect(el.querySelector('.status-winner')?.textContent).toMatch(/You Win!/);
  });
});
