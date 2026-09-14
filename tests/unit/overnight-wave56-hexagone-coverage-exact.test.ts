/**
 * Wave 56 leftover after #256 — Hex-a-Gone coverage exact string. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { renderStatus } from '../../src/games/hex-a-gone/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 56 hexagone — coverage', () => {
  it('Board: 0/N cells filled on opening', () => {
    const state = createInitialState();
    const el = document.createElement('div');
    renderStatus(state, el);
    expect(el.querySelector('.hex-a-gone-coverage')?.textContent).toBe(
      `Board: 0/${state.board.length} cells filled`
    );
  });
});
