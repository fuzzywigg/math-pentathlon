/**
 * Wave 56 leftover after #256 — Hex-a-Gone bank counts + shape icons. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState, INITIAL_BANK } from '../../src/games/hex-a-gone/types';
import { renderBoard } from '../../src/games/hex-a-gone/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 56 hexagone — bank icons', () => {
  it('hexagon/triangle counts and icons', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(), el);
    const hex = el.querySelector('[data-shape="hexagon"]');
    expect(hex?.querySelector('.block-count')?.textContent).toBe(
      `${INITIAL_BANK.hexagon} left`
    );
    expect(hex?.querySelector('.block-icon')?.textContent).toBe('⬡');
    expect(hex?.querySelector('.block-name')?.textContent).toBe('hexagon');
    const tri = el.querySelector('[data-shape="triangle"]');
    expect(tri?.querySelector('.block-count')?.textContent).toBe(
      `${INITIAL_BANK.triangle} left`
    );
    expect(tri?.querySelector('.block-icon')?.textContent).toBe('△');
  });
});
