/**
 * Wave 51 leftover after #233 — classic Hex board-ui edge chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { renderBoard } from '../../src/games/hex/board-ui';

describe('Wave 51 hex — edge chrome', () => {
  it('draws two p1 (top/bottom) and two p2 (left/right) edge paths', () => {
    const container = document.createElement('div');
    renderBoard(createInitialState(5), container);
    expect(container.querySelectorAll('.hex-edge-p1').length).toBe(2);
    expect(container.querySelectorAll('.hex-edge-p2').length).toBe(2);
  });
});
