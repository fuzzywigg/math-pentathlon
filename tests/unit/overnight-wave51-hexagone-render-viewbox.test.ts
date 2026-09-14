/**
 * Wave 51 leftover after #233 — Hex-a-Gone padded viewBox. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { renderBoard } from '../../src/games/hex-a-gone/board-ui';

describe('Wave 51 hexagone — viewBox', () => {
  it('pads board viewBox to -185 -195 370 390', () => {
    const container = document.createElement('div');
    renderBoard(createInitialState(), container);
    expect(container.querySelector('.hex-a-gone-board')?.getAttribute('viewBox')).toBe(
      '-185 -195 370 390'
    );
  });
});
