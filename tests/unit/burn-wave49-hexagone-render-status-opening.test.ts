/**
 * Wave 49 leftover after #221/#226/#227 — Hex-a-Gone renderStatus opening. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { renderStatus } from '../../src/games/hex-a-gone/board-ui';

describe('Wave 49 hexagone — status opening', () => {
  it('shows coverage 0/N and Blue/Red labels', () => {
    const state = createInitialState();
    const container = document.createElement('div');
    renderStatus(state, container);
    expect(container.querySelector('.hex-a-gone-status')).toBeTruthy();
    expect(container.querySelector('.hex-a-gone-coverage')?.textContent).toMatch(
      new RegExp(`0/${state.board.length}`)
    );
    expect(container.textContent).toMatch(/Blue/);
    expect(container.textContent).toMatch(/Red/);
  });
});
