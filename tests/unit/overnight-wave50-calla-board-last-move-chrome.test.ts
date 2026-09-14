/**
 * Overnight HEAVY leftover — Calla last-move info chrome after sow.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { makeMove, getLastMoveInfo } from '../../src/games/calla/rules';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Overnight wave50 calla — last-move chrome', () => {
  it('omits last-move on opening and mounts it after a sow', () => {
    const open = document.createElement('div');
    renderBoard(createInitialState(), open);
    expect(open.querySelector('.calla-last-move')).toBeNull();

    const next = makeMove(createInitialState(), 2);
    const after = document.createElement('div');
    renderBoard(next, after);
    const info = after.querySelector('.calla-last-move');
    expect(info?.textContent).toBe(getLastMoveInfo(next));
    expect(info?.textContent).toMatch(/Free turn/i);
  });
});
