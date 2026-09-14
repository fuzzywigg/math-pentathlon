/**
 * Wave 51 leftover after #233 — Hex-a-Gone bank shape buttons. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, INITIAL_BANK } from '../../src/games/hex-a-gone/types';
import { renderBoard } from '../../src/games/hex-a-gone/board-ui';

describe('Wave 51 hexagone — bank shapes', () => {
  it('renders one block btn per bank shape with data-shape', () => {
    const container = document.createElement('div');
    renderBoard(createInitialState(), container);
    const btns = container.querySelectorAll('.hex-a-gone-block-btn[data-shape]');
    expect(btns.length).toBe(Object.keys(INITIAL_BANK).length);
    expect(container.querySelector('[data-shape="hexagon"]')).toBeTruthy();
    expect(container.querySelector('[data-shape="triangle"]')).toBeTruthy();
  });
});
