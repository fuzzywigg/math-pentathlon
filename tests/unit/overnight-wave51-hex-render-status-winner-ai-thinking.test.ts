/**
 * Wave 51 leftover after #233 — classic Hex winner + AI thinking status. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { renderStatus } from '../../src/games/hex/board-ui';

describe('Wave 51 hex — winner thinking', () => {
  it('renders winner banner and AI thinking class', () => {
    const won = { ...createInitialState(5), winner: 'player1' as const };
    const winnerEl = document.createElement('div');
    renderStatus(won, winnerEl, 'human-vs-human');
    expect(winnerEl.querySelector('.status-winner')?.textContent).toMatch(/Blue Wins/);

    const think = document.createElement('div');
    renderStatus(createInitialState(5), think, 'human-vs-ai', true);
    expect(think.querySelector('.status-ai-thinking')?.textContent).toMatch(/AI is thinking/);
  });
});
