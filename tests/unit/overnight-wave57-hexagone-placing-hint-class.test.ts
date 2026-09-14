/**
 * Wave 57 leftover after #263 — Hex-a-Gone placing-hint exact. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { selectBlock, commitSelection } from '../../src/games/hex-a-gone/rules';
import { renderBoard } from '../../src/games/hex-a-gone/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 57 hexagone — placing hint', () => {
  it('placeBlocks shows .placing-hint Click an empty cell to place', () => {
    const selected = selectBlock(createInitialState(), 'triangle');
    const placing = commitSelection(selected);
    const el = document.createElement('div');
    renderBoard(placing, el);
    expect(el.querySelector('.placing-hint')?.textContent).toBe(
      'Click an empty cell to place'
    );
  });
});
