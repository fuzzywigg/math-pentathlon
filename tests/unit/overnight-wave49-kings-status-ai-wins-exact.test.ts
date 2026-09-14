/**
 * Wave 49 — Kings HvA AI Wins exact leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderStatus } from '../../src/games/kings-quadraphages/board-ui';

afterEach(() => { document.body.innerHTML = ''; });

describe('Wave 49 kings — AI Wins exact', () => {
  it('shows AI Wins when player2 wins vs AI', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const state = { ...createInitialGameState(), turnPhase: 'gameOver' as const, winner: 'player2' as const };
    renderStatus(state, el, 'human-vs-ai', 'hard', false);
    expect(el.querySelector('.status-winner')?.textContent).toMatch(/AI Wins!/);
  });
});
