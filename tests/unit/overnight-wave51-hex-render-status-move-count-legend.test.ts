/**
 * Overnight HEAVY leftovers after #234 — Hex move count + legend chrome. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { makeMove } from '../../src/games/hex/rules';
import { renderStatus } from '../../src/games/hex/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 51 hex — move count + legend', () => {
  it('increments Move N and keeps Top/Bottom Left/Right legend', () => {
    const box = document.createElement('div');
    document.body.appendChild(box);
    renderStatus(createInitialState(3), box);
    expect(box.querySelector('.hex-move-count')?.textContent).toBe('Move 1');
    expect(box.querySelector('.hex-legend-p1')?.textContent).toMatch(/Top ↔ Bottom/);
    expect(box.querySelector('.hex-legend-p2')?.textContent).toMatch(/Left ↔ Right/);

    let state = makeMove(createInitialState(3), { row: 1, col: 1 });
    state = makeMove(state, { row: 2, col: 0 });
    renderStatus(state, box);
    expect(box.querySelector('.hex-move-count')?.textContent).toBe('Move 3');
  });
});
