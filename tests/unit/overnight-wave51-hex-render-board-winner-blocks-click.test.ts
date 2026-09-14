/**
 * Overnight HEAVY leftovers after #234 — Hex winner blocks empty-cell clicks. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { makeMove } from '../../src/games/hex/rules';
import { renderBoard } from '../../src/games/hex/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 51 hex — winner blocks click', () => {
  it('does not fire onCellClick after Blue wins', () => {
    let state = createInitialState(3);
    state = makeMove(state, { row: 0, col: 0 });
    state = makeMove(state, { row: 0, col: 1 });
    state = makeMove(state, { row: 1, col: 0 });
    state = makeMove(state, { row: 0, col: 2 });
    state = makeMove(state, { row: 2, col: 0 });
    expect(state.winner).toBe('player1');
    const box = document.createElement('div');
    document.body.appendChild(box);
    let hits = 0;
    renderBoard(state, box, () => {
      hits++;
    });
    const empty = box.querySelector(
      '.hex-cell-group[data-row="1"][data-col="2"]'
    ) as SVGGElement;
    empty.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(hits).toBe(0);
  });
});
