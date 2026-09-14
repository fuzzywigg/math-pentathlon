/**
 * Wave 52 — Kings quad glyph leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderBoard } from '../../src/games/kings-quadraphages/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 52 kings — quad glyph', () => {
  it('renders ● with cell-quad on forged quadraphage', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const base = createInitialGameState();
    const board = base.board.map((row) => row.slice());
    board[3][3] = { type: 'quadraphage', owner: 'player1' };
    renderBoard({ ...base, board }, container);
    const cell = container.querySelector('.cell[data-row="4"][data-col="4"]');
    expect(cell?.classList.contains('cell-quad')).toBe(true);
    expect(cell?.classList.contains('cell-p1')).toBe(true);
    expect(cell?.textContent).toBe('●');
  });
});
