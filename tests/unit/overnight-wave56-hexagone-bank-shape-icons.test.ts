/**
 * Wave 56 leftover after #256 — Hex-a-Gone bank glyph icons. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { renderBoard } from '../../src/games/hex-a-gone/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 56 hexagone — bank icons', () => {
  it('renders hexagon/triangle/square glyphs in bank', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(), el);
    const hex = el.querySelector('[data-shape="hexagon"] .block-icon')?.textContent;
    const tri = el.querySelector('[data-shape="triangle"] .block-icon')?.textContent;
    const sq = el.querySelector('[data-shape="square"] .block-icon')?.textContent;
    expect(hex).toBe('⬡');
    expect(tri).toBe('△');
    expect(sq).toBe('□');
  });
});
