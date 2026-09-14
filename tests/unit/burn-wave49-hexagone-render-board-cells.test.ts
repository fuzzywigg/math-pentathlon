/**
 * Wave 49 leftover after #221/#226/#227 — Hex-a-Gone renderBoard cells. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { renderBoard } from '../../src/games/hex-a-gone/board-ui';

describe('Wave 49 hexagone — renderBoard', () => {
  it('fills container with hex cells matching board length', () => {
    const state = createInitialState();
    const container = document.createElement('div');
    renderBoard(state, container);
    expect(container.querySelector('.hex-a-gone-wrapper')).toBeTruthy();
    expect(container.querySelectorAll('.hex-a-gone-cell').length).toBe(state.board.length);
  });
});
