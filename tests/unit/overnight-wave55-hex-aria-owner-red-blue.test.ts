/**
 * Wave 55 leftover after #250 — Hex occupied aria Blue/Red, no valid placement. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { makeMove } from '../../src/games/hex/rules';
import { renderBoard } from '../../src/games/hex/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 55 hex — owner aria', () => {
  it('P1 Blue then P2 Red labels omit valid placement', () => {
    let s = makeMove(createInitialState(5), { row: 0, col: 0 });
    s = makeMove(s, { row: 1, col: 1 });
    const el = document.createElement('div');
    renderBoard(s, el, () => undefined);
    const p1 = el.querySelector('[data-row="0"][data-col="0"]')?.getAttribute('aria-label') ?? '';
    const p2 = el.querySelector('[data-row="1"][data-col="1"]')?.getAttribute('aria-label') ?? '';
    expect(p1).toMatch(/Blue/);
    expect(p2).toMatch(/Red/);
    expect(p1).not.toMatch(/valid placement/);
    expect(p2).not.toMatch(/valid placement/);
  });
});
