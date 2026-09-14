/**
 * Overnight HEAVY leftovers after #234 — Hex HvH Blue/Red status chrome. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { makeMove } from '../../src/games/hex/rules';
import { renderStatus } from '../../src/games/hex/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 51 hex — HvH status', () => {
  it('shows Blue turn then Red turn text', () => {
    const box = document.createElement('div');
    document.body.appendChild(box);
    renderStatus(createInitialState(3), box, 'human-vs-human');
    expect(box.querySelector('.hex-status')).toBeTruthy();
    expect(box.querySelector('.status-turn')?.textContent).toMatch(/Blue's turn/);
    expect(box.querySelector('.status-mode')).toBeNull();

    let state = makeMove(createInitialState(3), { row: 1, col: 1 });
    renderStatus(state, box, 'human-vs-human');
    expect(box.querySelector('.status-turn')?.textContent).toMatch(/Red's turn/);
  });
});
