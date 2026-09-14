/**
 * Wave 55 leftover after #250 — Hex-a-Gone Confirm (2 blocks) chrome. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { selectBlock } from '../../src/games/hex-a-gone/rules';
import { renderBoard } from '../../src/games/hex-a-gone/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 55 hexagone — confirm plural', () => {
  it('two selected blocks show Confirm (2 blocks)', () => {
    let s = selectBlock(createInitialState(), 'triangle');
    s = selectBlock(s, 'square');
    const el = document.createElement('div');
    renderBoard(s, el, undefined, undefined, () => undefined);
    expect(el.querySelector('.hex-a-gone-confirm-btn')?.textContent).toBe(
      'Confirm (2 blocks)'
    );
    expect(el.querySelectorAll('.selected-shape')).toHaveLength(2);
  });
});
