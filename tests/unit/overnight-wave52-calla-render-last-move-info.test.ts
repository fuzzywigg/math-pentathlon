/**
 * Overnight HEAVY leftover after #234 — Calla last-move info panel after sow. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { makeMove } from '../../src/games/calla/rules';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 52 calla — last-move panel', () => {
  it('shows calla-last-move text after a sow; absent on opening', () => {
    const open = document.createElement('div');
    renderBoard(createInitialState(), open);
    expect(open.querySelector('.calla-last-move')).toBeFalsy();

    const next = makeMove(createInitialState(), 0);
    const el = document.createElement('div');
    renderBoard(next, el);
    const info = el.querySelector('.calla-last-move');
    expect(info).toBeTruthy();
    expect(info?.textContent).toMatch(/Blue distributed/);
  });
});
