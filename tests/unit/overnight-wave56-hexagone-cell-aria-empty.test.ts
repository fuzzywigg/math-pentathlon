/**
 * Wave 56 leftover after #256 — Hex-a-Gone empty cell aria without callback. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { renderBoard } from '../../src/games/hex-a-gone/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 56 hexagone — empty aria', () => {
  it('center empty cell is q,r, empty', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(), el);
    const cell = el.querySelector('[data-q="0"][data-r="0"]');
    expect(cell?.getAttribute('aria-label')).toBe('0,0, empty');
  });
});
