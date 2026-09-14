/**
 * Overnight HEAVY leftovers after #234 — Hex AI thinking + winner banners. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { makeMove } from '../../src/games/hex/rules';
import { renderStatus } from '../../src/games/hex/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 51 hex — thinking + winners', () => {
  it('shows thinking class and You/AI/Blue/Red win banners', () => {
    const box = document.createElement('div');
    document.body.appendChild(box);
    renderStatus(createInitialState(3), box, 'human-vs-ai', true);
    expect(box.querySelector('.status-ai-thinking')?.textContent).toMatch(/thinking/);

    let win = createInitialState(3);
    win = makeMove(win, { row: 0, col: 0 });
    win = makeMove(win, { row: 0, col: 1 });
    win = makeMove(win, { row: 1, col: 0 });
    win = makeMove(win, { row: 0, col: 2 });
    win = makeMove(win, { row: 2, col: 0 });
    expect(win.winner).toBe('player1');

    renderStatus(win, box, 'human-vs-ai');
    expect(box.querySelector('.status-winner')?.textContent).toMatch(/You Win/);

    renderStatus(win, box, 'human-vs-human');
    expect(box.querySelector('.status-winner')?.textContent).toMatch(/Blue Wins/);

    const redWin = {
      ...createInitialState(3),
      winner: 'player2' as const,
      moveHistory: [
        { player: 'player2' as const, position: { row: 0, col: 0 }, moveNumber: 1 },
      ],
    };
    renderStatus(redWin, box, 'human-vs-ai');
    expect(box.querySelector('.status-winner')?.textContent).toMatch(/AI Wins/);
    renderStatus(redWin, box, 'human-vs-human');
    expect(box.querySelector('.status-winner')?.textContent).toMatch(/Red Wins/);
  });
});
