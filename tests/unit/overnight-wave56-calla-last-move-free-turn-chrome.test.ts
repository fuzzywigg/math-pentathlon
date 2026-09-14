/**
 * Wave 56 leftover after #256 — Calla last-move Free turn! render chrome.
 * Distinct from wave52 engine free-turn info string. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { makeMove } from '../../src/games/calla/rules';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 56 calla — last-move free turn chrome', () => {
  it('mounts Free turn! last-move banner after landing in calla', () => {
    const next = makeMove(createInitialState(), 2);
    expect(next.moveHistory[0]?.gotFreeTurn).toBe(true);
    const el = document.createElement('div');
    renderBoard(next, el);
    expect(el.querySelector('.calla-last-move')?.textContent).toMatch(
      /Free turn!/
    );
    expect(el.querySelector('.calla-last-move')?.textContent).toMatch(
      /Blue distributed 3 cubes/
    );
  });
});
