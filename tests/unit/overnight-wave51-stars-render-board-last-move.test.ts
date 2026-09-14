/**
 * Wave 51 leftover after #233 — Stars-Bars last-move class. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/stars-bars/rules';
import { renderBoard } from '../../src/games/stars-bars/board-ui';

describe('Wave 51 stars — last-move', () => {
  it('adds .last-move on lastMove cell', () => {
    const base = createInitialState();
    const state = {
      ...base,
      lastMove: { row: 2, col: 3 },
      cells: base.cells.map((row, r) =>
        row.map((cell, c) =>
          r === 2 && c === 3
            ? { ...cell, owner: 'player1' as const, card: base.playerHands.player1[0] }
            : cell
        )
      ),
    };
    const el = renderBoard(state, () => undefined);
    expect(el.querySelector('.stars-cell.last-move[data-row="2"][data-col="3"]')).toBeTruthy();
  });
});
