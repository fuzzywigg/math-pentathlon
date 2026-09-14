/**
 * Wave 59 leftover after #276 — Hex-a-Gone Confirm (3 blocks) + Selected chrome. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { selectBlock } from '../../src/games/hex-a-gone/rules';
import { renderBoard } from '../../src/games/hex-a-gone/board-ui';

describe('Wave 59 hexagone — confirm three blocks', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('three-shape select shows Confirm (3 blocks) + Selected chrome', () => {
    let state = createInitialState();
    state = selectBlock(state, 'triangle');
    state = selectBlock(state, 'square');
    state = selectBlock(state, 'rhombus');
    const el = document.createElement('div');
    renderBoard(state, el, undefined, undefined, () => {});
    expect(el.querySelector('.hex-a-gone-confirm-btn')?.textContent).toBe(
      'Confirm (3 blocks)'
    );
    expect(el.querySelector('.selected-blocks')?.textContent).toMatch(/Selected:/);
    expect(el.querySelectorAll('.selected-shape')).toHaveLength(3);
  });
});
