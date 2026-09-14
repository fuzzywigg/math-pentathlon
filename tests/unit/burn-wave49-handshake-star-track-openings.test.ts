/**
 * Wave 49 — Handshake star-track opening chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { renderBoard, renderStatus } from '../../src/games/star-track/board-ui';

describe('Wave 49 handshake — star-track opening', () => {
  it('board + status mount', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    const s = createInitialState();
    renderBoard(s, board, () => {});
    renderStatus(s, status);
    expect(board.querySelector('.star-track-board')).toBeTruthy();
    expect(status.querySelector('.star-track-status')).toBeTruthy();
  });
});
