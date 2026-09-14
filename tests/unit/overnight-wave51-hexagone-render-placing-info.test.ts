/**
 * Wave 51 leftover after #233 — Hex-a-Gone placing info + placing class. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { selectBlock, commitSelection } from '../../src/games/hex-a-gone/rules';
import { renderBoard } from '../../src/games/hex-a-gone/board-ui';

describe('Wave 51 hexagone — placing info', () => {
  it('shows placing-info and placing bank class after commit', () => {
    let state = selectBlock(createInitialState(), 'rhombus');
    state = commitSelection(state);
    const container = document.createElement('div');
    renderBoard(state, container);
    expect(container.querySelector('.hex-a-gone-placing-info')?.textContent).toMatch(/rhombus/i);
    expect(container.querySelector('.hex-a-gone-placing-info')?.textContent).toMatch(
      /Click an empty cell/
    );
    expect(
      container
        .querySelector('.hex-a-gone-block-btn[data-shape="rhombus"]')
        ?.classList.contains('placing')
    ).toBe(true);
  });
});
