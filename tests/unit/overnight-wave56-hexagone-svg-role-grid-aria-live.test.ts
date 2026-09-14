/**
 * Wave 56 leftover after #256 — Hex-a-Gone SVG grid + status live. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { renderBoard, renderStatus } from '../../src/games/hex-a-gone/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 56 hexagone — a11y chrome', () => {
  it('board role=grid; status aria-live=polite', () => {
    const board = document.createElement('div');
    renderBoard(createInitialState(), board);
    expect(board.querySelector('.hex-a-gone-board')?.getAttribute('role')).toBe('grid');
    const status = document.createElement('div');
    renderStatus(createInitialState(), status);
    expect(status.getAttribute('role')).toBe('status');
    expect(status.getAttribute('aria-live')).toBe('polite');
  });
});
