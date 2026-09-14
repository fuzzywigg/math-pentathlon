/**
 * Wave 49 — Star-track hvai winner You/AI labels. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { renderStatus } from '../../src/games/star-track/board-ui';

describe('Wave 49 star-track — hvai winners', () => {
  it('labels You and AI', () => {
    const box = document.createElement('div');
    const base = { ...createInitialState(), phase: 'gameOver' as const };
    renderStatus({ ...base, winner: 'player1' }, box, 'human-vs-ai');
    expect(box.querySelector('.status-winner')?.textContent).toMatch(/You Wins?/);
    renderStatus({ ...base, winner: 'player2' }, box, 'human-vs-ai');
    expect(box.querySelector('.status-winner')?.textContent).toMatch(/AI Wins/);
  });
});
