/**
 * Wave 55 leftover after #250 — Kings opening king glyphs + empty cell class. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderBoard } from '../../src/games/kings-quadraphages/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 55 kings — opening glyphs', () => {
  it('p1/p2 kings are ♚ and A1 is cell-empty', () => {
    const el = document.createElement('div');
    renderBoard(createInitialGameState(), el);
    const p1 = el.querySelector('.cell[data-row="1"][data-col="5"]');
    const p2 = el.querySelector('.cell[data-row="9"][data-col="5"]');
    const empty = el.querySelector('.cell[data-row="1"][data-col="1"]');
    expect(p1?.classList.contains('cell-king')).toBe(true);
    expect(p1?.classList.contains('cell-p1')).toBe(true);
    expect(p1?.textContent).toBe('♚');
    expect(p2?.classList.contains('cell-king')).toBe(true);
    expect(p2?.classList.contains('cell-p2')).toBe(true);
    expect(p2?.textContent).toBe('♚');
    expect(empty?.classList.contains('cell-empty')).toBe(true);
    expect(empty?.textContent).toBe('');
  });
});
