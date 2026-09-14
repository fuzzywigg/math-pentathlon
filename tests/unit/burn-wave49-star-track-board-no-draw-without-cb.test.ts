/**
 * Wave 49 — Star-track no draw btn without callback. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { renderBoard } from '../../src/games/star-track/board-ui';

describe('Wave 49 star-track — no draw without cb', () => {
  it('omits draw button when callback missing', () => {
    const box = document.createElement('div');
    renderBoard(createInitialState(), box);
    expect(box.querySelector('.star-track-draw-btn')).toBeNull();
  });
});
