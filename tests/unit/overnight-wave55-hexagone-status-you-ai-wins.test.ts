/**
 * Wave 55 leftover after #250 — Hex-a-Gone HvA You/AI Wins strings. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { renderStatus } from '../../src/games/hex-a-gone/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 55 hexagone — HvA winners', () => {
  it('You Wins and AI Wins banners', () => {
    const s = createInitialState();
    const you = document.createElement('div');
    renderStatus({ ...s, winner: 'player1' }, you, 'human-vs-ai');
    expect(you.querySelector('.status-winner')?.textContent).toMatch(/You Wins!/);
    const ai = document.createElement('div');
    renderStatus({ ...s, winner: 'player2' }, ai, 'human-vs-ai');
    expect(ai.querySelector('.status-winner')?.textContent).toMatch(/AI Wins!/);
  });
});
