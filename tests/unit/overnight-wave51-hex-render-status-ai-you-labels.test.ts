/**
 * Overnight HEAVY leftovers after #234 — Hex AI You/AI status labels. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { makeMove } from '../../src/games/hex/rules';
import { renderStatus } from '../../src/games/hex/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 51 hex — AI status labels', () => {
  it('uses You/AI turn wording and vs AI mode chip', () => {
    const box = document.createElement('div');
    document.body.appendChild(box);
    renderStatus(createInitialState(3), box, 'human-vs-ai');
    expect(box.querySelector('.status-mode')?.textContent).toBe('vs AI');
    expect(box.querySelector('.status-turn')?.textContent).toMatch(/Your turn/);
    expect(box.querySelector('.hex-legend-p1')?.textContent).toMatch(/You:/);
    expect(box.querySelector('.hex-legend-p2')?.textContent).toMatch(/AI:/);

    const after = makeMove(createInitialState(3), { row: 0, col: 0 });
    renderStatus(after, box, 'human-vs-ai');
    expect(box.querySelector('.status-turn')?.textContent).toMatch(/AI's turn/);
  });
});
