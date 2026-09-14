/**
 * Wave 63 leftover after #301 — Hex-a-Gone selection-area + bank-blocks mount. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { renderBoard } from '../../src/games/hex-a-gone/board-ui';

describe('Wave 63 hexagone — selection area bank blocks', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('mounts selection-area and bank-blocks with five shape buttons', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(), el, undefined, undefined, () => {});
    expect(el.querySelectorAll('.hex-a-gone-selection-area')).toHaveLength(1);
    expect(el.querySelectorAll('.hex-a-gone-bank-blocks')).toHaveLength(1);
    expect(el.querySelectorAll('.hex-a-gone-block-btn')).toHaveLength(5);
  });
});
