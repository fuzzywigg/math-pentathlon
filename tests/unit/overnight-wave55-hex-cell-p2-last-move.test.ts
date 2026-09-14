/**
 * Wave 55 leftover after #250 — Hex P2 owner class + last-move on that cell. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { makeMove } from '../../src/games/hex/rules';
import { renderBoard } from '../../src/games/hex/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 55 hex — p2 last move', () => {
  it('P2 cell has hex-cell-p2 and last-move', () => {
    let s = makeMove(createInitialState(5), { row: 0, col: 0 });
    s = makeMove(s, { row: 2, col: 2 });
    const el = document.createElement('div');
    renderBoard(s, el, () => undefined);
    const hex = el.querySelector('[data-row="2"][data-col="2"] .hex-cell');
    expect(hex?.classList.contains('hex-cell-p2')).toBe(true);
    expect(hex?.classList.contains('hex-cell-last-move')).toBe(true);
  });
});
