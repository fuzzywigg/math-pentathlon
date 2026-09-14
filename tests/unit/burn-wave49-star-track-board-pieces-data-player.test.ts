/**
 * Wave 49 — Star-track piece data-player attrs. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { renderBoard } from '../../src/games/star-track/board-ui';

describe('Wave 49 star-track — pieces', () => {
  it('renders p1/p2 pieces with data-player', () => {
    const box = document.createElement('div');
    renderBoard(createInitialState(), box);
    expect(box.querySelector('.star-track-piece-p1')?.getAttribute('data-player')).toBe('player1');
    expect(box.querySelector('.star-track-piece-p2')?.getAttribute('data-player')).toBe('player2');
  });
});
